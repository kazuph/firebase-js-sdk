/**
 * @license
 * Copyright 2020 Google Inc.
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

import { LimitType, Query } from './query';
import { SnapshotVersion } from './snapshot_version';
import { JsonProtoSerializer } from '../remote/serializer';
import { Timestamp } from '../api/timestamp';
import {NamedBundleQuery} from "../protos/firestore_bundle_proto";

export class NamedQuery {
  static from(
    bundleQuery: NamedBundleQuery,
    serializer: JsonProtoSerializer
  ): NamedQuery {
    const target = serializer.fromQueryTarget(bundleQuery.queryTarget!);
    const query = new Query(
      target.path,
      target.collectionGroup,
      target.orderBy,
      target.filters,
      target.limit,
      LimitType.First,
      target.startAt,
      target.endAt
    );
    return new NamedQuery(
      query,
      SnapshotVersion.fromTimestamp(
        new Timestamp(
          bundleQuery.readTime!.seconds!,
          bundleQuery.readTime!.nanos!
        )
      )
    );
  }

  constructor(readonly query: Query, readonly readTime: SnapshotVersion) {}
}
