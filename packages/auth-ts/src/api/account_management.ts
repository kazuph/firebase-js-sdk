/**
 * @license
 * Copyright 2019 Google Inc.
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

import { Auth } from '..';
import { performApiRequest, HttpMethod, Endpoint } from '.';
import { Operation } from '../model/action_code_info';

export interface ResetPasswordRequest {
  oobCode: string;
  newPassword?: string;
}

export interface ResetPasswordResponse {
  email: string;
  newEmail?: string;
  requestType?: Operation;
}

export async function resetPassword(
  auth: Auth,
  request: ResetPasswordRequest
): Promise<ResetPasswordResponse> {
  return performApiRequest<ResetPasswordRequest, ResetPasswordResponse>(
    auth,
    HttpMethod.POST,
    Endpoint.RESET_PASSWORD,
    request
  );
}

export interface DeleteAccountRequest {
  idToken: string;
}

export async function deleteAccount(auth: Auth, request: DeleteAccountRequest): Promise<void> {
  return performApiRequest<DeleteAccountRequest, void>(
    auth,
    HttpMethod.POST,
    Endpoint.DELETE_ACCOUNT,
    request);
}