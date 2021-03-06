/**
 * JBoss, Home of Professional Open Source
 * Copyright Red Hat, Inc., and individual contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.jboss.aerogear.connectivity.service;

import java.util.List;

import org.jboss.aerogear.connectivity.model.iOSVariant;

// TODO: make generic Variant Service:
public interface iOSVariantService {
    
    iOSVariant addiOSVariant(iOSVariant iOSVariant);
    iOSVariant updateiOSVariant(iOSVariant iOSVariant);
    void removeiOSVariant(iOSVariant iOSVariant);
    
    List<iOSVariant> findAlliOSVariants();
    iOSVariant findByVariantIDForDeveloper(String variantID, String loginName);


}
