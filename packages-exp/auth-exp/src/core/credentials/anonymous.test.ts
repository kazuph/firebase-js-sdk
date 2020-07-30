/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { ProviderId, SignInMethod } from '@firebase/auth-types-exp';

import { mockEndpoint } from '../../../test/helpers/api/helper';
import { testAuth, TestAuth } from '../../../test/helpers/mock_auth';
import * as mockFetch from '../../../test/helpers/mock_fetch';
import { Endpoint } from '../../api';
import { APIUserInfo } from '../../api/account_management/account';
import { AnonymousCredential } from './anonymous';

use(chaiAsPromised);

describe('core/credentials/anonymous', () => {
  let auth: TestAuth;
  let credential: AnonymousCredential;

  beforeEach(async () => {
    auth = await testAuth();
    credential = new AnonymousCredential();
  });

  it('should have an anonymous provider', () => {
    expect(credential.providerId).to.eq(ProviderId.ANONYMOUS);
  });

  it('should have an anonymous sign in method', () => {
    expect(credential.signInMethod).to.eq(SignInMethod.ANONYMOUS);
  });

  describe('#toJSON', () => {
    it('throws', () => {
      expect(credential.toJSON).to.throw(Error);
    });
  });

  describe('#_getIdTokenResponse', () => {
    const serverUser: APIUserInfo = {
      localId: 'local-id'
    };

    beforeEach(() => {
      mockFetch.setUp();
      mockEndpoint(Endpoint.SIGN_UP, {
        idToken: 'id-token',
        refreshToken: 'refresh-token',
        expiresIn: '1234',
        localId: serverUser.localId!
      });
    });
    afterEach(mockFetch.tearDown);

    it('calls signUp', async () => {
      const idTokenResponse = await credential._getIdTokenResponse(auth);
      expect(idTokenResponse.idToken).to.eq('id-token');
      expect(idTokenResponse.refreshToken).to.eq('refresh-token');
      expect(idTokenResponse.expiresIn).to.eq('1234');
      expect(idTokenResponse.localId).to.eq(serverUser.localId);
    });
  });

  describe('#_linkToIdToken', () => {
    it('throws', async () => {
      await expect(
        credential._linkToIdToken(auth, 'id-token')
      ).to.be.rejectedWith(Error);
    });
  });

  describe('#_getReauthenticationResolver', () => {
    it('throws', () => {
      expect(() => credential._getReauthenticationResolver(auth)).to.throw(
        Error
      );
    });
  });
});
