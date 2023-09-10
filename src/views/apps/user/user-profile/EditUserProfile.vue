<!-- eslint-disable -->
<template>
  <div id="user-profile">
    <horizontal-navbar @go-back="goBack" :arrow-visible="true"/>

    <validation-observer ref="refFormObserver" v-slot="{ errors }">
      <b-form v-if="userData" class="mt-1" cols="8">
        <!-- Card: Personal Info-->
        <b-card class="personal-info">
          <div class="profile-title">
            <h2 class="text-black">
              {{ firstName }} {{ lastName }}
              <span class="font-small-4">- {{ userData.userType }}</span>
            </h2>
            <p v-if="responsibleUser" class="text-black">
              {{ $t('roles.consul') }}: {{ responsibleUser }}
            </p>
          </div>

          <div class="d-flex align-items-center justify-content-end">
            <!-- edit buttons -->
            <template v-if="userData.role === 'farmer'">
              <div class="text-nowrap ml-auto">
                <form-select-standard :id="userData.id"
                                      :is-disabled="isMyProfile && userData.role === 'farmer'"
                                      :selected="userData.published ? userData.published : 'NotSet'"
                                      :loader="loader"
                                      :options="null"
                                      @update="publishFarmer"/>
              </div>
            </template>
            <!-- /edit buttons -->

            <!-- edit buttons -->
            <template>
              <b-button
                  variant="primary"
                  class="ml-4"
                  :disabled="isInvalid(errors) || disableEdit"
                  @click="editUser"
              >
                <feather-icon
                    icon="EditIcon"
                    class="d-block d-md-none"
                />
                <span class="font-weight-bold d-none d-md-block">{{ $t('global.save') }}</span>
              </b-button>
            </template>
            <!-- /edit buttons -->
          </div>
        </b-card>

        <!-- Card: Cover Image-->
        <b-card v-if="userData.role === 'farmer'"
            cols="12"
            class="mb-2"
        >
          <div class="border rounded p-2">
            <h4 class="mb-1">
              {{ $t('blog.coverPhoto') }}
            </h4>
            <template v-if="coverImage.name">
              <p class="mt-1 mb-1">
                {{ $t('uploadImage.uploadedImage') }}:
              </p>
              <div class="image-wrapper">
                <div class="">
                  <img class="mw-100" :src="staticEnvValue + `/` + coverImage.name"/>
                </div>
              </div>
            </template>
            <image-upload
                id="cover_image"
                :on-crop="addCoverImage" :x="1560" :y="318"/>
          </div>
        </b-card>

        <!-- Card: Profile Image-->
        <b-card v-if="userData.role === 'farmer'"
            cols="12"
            class="mb-2"
        >
          <div class="border rounded p-2">
            <h4 class="mb-1">
              {{ $t('users.profilePicture') }}
            </h4>
            <template v-if="profileImage.name">
              <p class="mt-1 mb-1">
                {{ $t('uploadImage.UploadedImage') }}:
              </p>
              <div class="image-wrapper">
                <div class="">
                  <img class="mw-100" :src="staticEnvValue + `/` + profileImage.name"/>
                </div>
              </div>
            </template>
            <image-upload id="profile_image"
                          :on-crop="addProfileImage" :x="367" :y="462"/>
          </div>
        </b-card>

        <!-- Card: Farmer Certificates -->
        <b-card v-if="userData.role === 'farmer'">
          <!-- Header: Certificate -->
          <div class="d-flex mb-2">
            <feather-icon
                icon="InfoIcon"
                size="19"
            />
            <h4 class="mb-0 ml-50">
              {{ $t('users.aboutFarmer') }}
            </h4>
          </div>

          <!-- Form: Certificate -->
          <b-row class="mt-1 d-flex justify-content-between">

            <!-- Field: Stickers -->
            <b-col
                cols="12"
                md="6"
                lg="6"
            >
              <b-form-group
                  class="text-center"
                  :label="$t('sticker.title')"
                  label-for="stickers"
              >
                <div class="flex-wrap mx-auto my-1 d-flex">
                  <div v-for="item in stickers" :key="item.title"
                       class="py-1 mx-auto mb-1 border rounded d-flex justify-content-center align-items-center"
                       style="width:45%">
                    <label class="mb-0" style="width:100%">{{ item.title }}</label>
                    <b-form-checkbox v-model="selectedStickers[item.id]" name="check-button"
                                     :disabled="isMyProfile && userData.role === 'farmer'" switch/>
                  </div>
                </div>
              </b-form-group>
            </b-col>

            <!-- Responsible Consul -->
            <b-col cols="12"
                   md="6"
                   lg="4">
              <b-form-group
                  :label="$t('users.responsiblePerson')"
                  label-for="consul">
                <v-select
                    v-model="responsibleUser"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="consulsList"
                    :disabled="isMyProfile && userData.role === 'farmer'"
                    label="title"
                >
                  <template #option="{ title }">
                    <span> {{ title }}</span>
                  </template>
                </v-select>
              </b-form-group>
            </b-col>

          </b-row>
        </b-card>

        <!-- Card: Farmer Certificates -->
        <b-card v-if="userData.role === 'farmer'">
          <!-- Header: Certificate -->
          <div class="d-flex mb-2">
            <feather-icon
                icon="InfoIcon"
                size="19"
            />
            <h4 class="mb-0 ml-50">
              {{ $t('certificates.title') }}
            </h4>
          </div>

          <!-- Form: Certificate -->
          <b-row v-if="selectedStickersArray.length > 0" class="mt-1 d-flex flex-wrap justify-content-between">

            <certificates v-for="sticker in selectedStickersArray" :key="sticker.id"
                          :sticker="sticker"
                          :is-editable="!isMyProfile || userData.role !== 'farmer'"
                          :certificates-object="groupedCertificates.find(el => el.id == sticker.id) ? groupedCertificates.find(el => el.id == sticker.id) : {}"
                          @add="updateCertificates"
                          @delete="deleteCertificate"
                          @update="updateCertificates"/>
          </b-row>
        </b-card>

        <!-- Card: Personal Info -->
        <b-card>
          <!-- Header: Personal Info -->
          <div class="d-flex mb-2">
            <feather-icon
                icon="UserIcon"
                size="19"
            />
            <h4 class="mb-0 ml-50">
              {{ $t('users.personalInfo') }}
            </h4>
          </div>

          <!-- Form: Personal Info Form -->
          <b-row class="pl-2 pr-2 d-flex align-items-center justify-content-start">
            <!-- First Name -->
            <validation-provider class="mr-2"
                                 v-slot="{errors, valid, dirty }"
                                 name="სახელი"
                                 rules="required"
            >
              <b-form-group
                  :label="isLegalEntity? $t('users.directorFirstname') + ' *' : $t('users.name') + ' *'"
                  label-for="first-name"
              >
                <b-form-input
                    id="first-name"
                    v-model="firstName"
                    :disabled="isMyProfile && userData.role === 'farmer'"
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    autofocus
                    trim
                    placeholder="John"
                />
              </b-form-group>
            </validation-provider>
            <!-- First Name English -->
            <validation-provider v-if="!isLegalEntity && userData.role === 'farmer'" class="mr-2"
                                 v-slot="{errors, valid, dirty }"
                                 :name="$t('users.name_eng')"
                                 rules="required"
            >
              <b-form-group
                  :label="isLegalEntity? $t('users.directorFirstname') + ' ' + $t('global.eng') + ' *' : $t('users.name_eng') + ' *'"
                  label-for="first-name_en"
              >
                <b-form-input
                    :disabled="isMyProfile && userData.role === 'farmer'"
                    id="first-name_en"
                    v-model="firstName_en"
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    autofocus
                    trim
                    placeholder="John"
                />
              </b-form-group>
            </validation-provider>
            <!-- Last Name -->
            <validation-provider class="mr-2"
                                 v-slot="{ errors, valid, dirty }"
                                 :name="$t('users.lastname')"
                                 rules="required"
            >
              <b-form-group
                  :label="isLegalEntity? $t('users.directorLastname') + ' *' : $t('users.lastname') + ' *'"
                  label-for="last-name"
              >
                <b-form-input
                    id="last-name"
                    v-model="lastName"
                    :disabled="isMyProfile && userData.role === 'farmer'"
                    autofocus
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    trim
                    placeholder="Doe"
                />
              </b-form-group>
            </validation-provider>
            <!-- Last Name English-->
            <validation-provider v-if="!isLegalEntity && userData.role === 'farmer'" class="mr-2"
                                 v-slot="{ errors, valid, dirty }"
                                 :name="$t('users.lastname_eng')"
                                 rules="required"
            >
              <b-form-group
                  :label="isLegalEntity? $t('users.directorLastname') + ' ' + $t('global.eng') + ' *' : $t('users.lastname_eng') + ' *'"
                  label-for="last-name_en"
              >
                <b-form-input
                    :disabled="isMyProfile && userData.role === 'farmer'"
                    id="last-name_en"
                    v-model="lastName_en"
                    autofocus
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    trim
                    placeholder="Doe"
                />
              </b-form-group>
            </validation-provider>
            <!-- User Name -->
            <validation-provider class="mr-2"
                                 v-slot=""
                                 :name=" $t('users.username')"
                                 rules="required"
            >
              <b-form-group
                  :label=" $t('users.username')"
                  label-for="user-name"
              >
                <b-form-input
                    id="user-name"
                    v-model="userName"
                    autofocus
                    :state="validate_username"
                    trim
                    placeholder="Doe"
                />
              </b-form-group>
            </validation-provider>
            <!-- Identity Number -->
            <validation-provider class="mr-2"
                                 v-slot="{errors, valid, dirty }"
                                 :name=" $t('users.personalId')"
                                 :rules="'digits:11'">
              <b-form-group
                  :label="isLegalEntity?  $t('users.directorPersonalId') :  $t('users.personalId')"
                  label-for="identity">
                <b-form-input
                    :disabled="isMyProfile && userData.role === 'farmer'"
                    id="identity"
                    v-model="identity"
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    trim/>
              </b-form-group>
            </validation-provider>
          </b-row>
        </b-card>

        <!-- Card: Juridical Info -->
        <b-card v-if="(userData.role === 'farmer' || userData.role === 'consul') && isLegalEntity">
          <!-- Header: Juridical Info -->
          <div class="d-flex mb-2">
            <feather-icon
                icon="UserIcon"
                size="19"
            />
            <h4 class="mb-0 ml-50">
              {{  $t('users.legalEntityInfo') }}
            </h4>
          </div>

          <!-- Form: Juridical Info Form -->
          <b-row class="pl-2 pr-2 d-flex align-items-center justify-content-start">
            <!-- Juridical Info: Commercial Name -->
            <validation-provider class="mr-2"
                                 v-slot="{errors, valid, dirty }"
                                 name="Commercial Name"
                                 rules="">
              <b-form-group
                  :label=" $t('users.commercialName')"
                  label-for="commercialName">
                <b-form-input
                    id="commercialName"
                    v-model="juridicalInfo.commercialName"
                    :disabled="isMyProfile && userData.role === 'farmer'"
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    trim/>
              </b-form-group>
            </validation-provider>
            <!-- Juridical Info: Commercial Name English-->
            <validation-provider class="mr-2"
                                 v-slot="{errors, valid, dirty }"
                                 name="Commercial Name"
                                 rules="">
              <b-form-group
                  :label=" $t('users.commercialName_en')"
                  label-for="commercialName_en">
                <b-form-input
                    id="commercialName_en"
                    v-model="juridicalInfo.commercialName_en"
                    :disabled="isMyProfile && userData.role === 'farmer'"
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    trim/>
              </b-form-group>
            </validation-provider>
            <!-- Juridical Info: Juridical Name -->
            <validation-provider class="mr-2"
                                 v-slot="{errors, valid, dirty }"
                                 :name=" $t('users.legalName')"
                                 rules="">
              <b-form-group
                  :label=" $t('users.legalName')"
                  label-for="juridicalName">
                <b-form-input
                    id="juridicalName"
                    v-model="juridicalInfo.juridicalName"
                    :disabled="isMyProfile && userData.role === 'farmer'"
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    trim/>
              </b-form-group>
            </validation-provider>
            <!-- Juridical Info: Identification Number -->
            <validation-provider class="mr-2"
                                 v-slot="{errors, valid, dirty }"
                                 name="Identification Number"
                                 rules="">
              <b-form-group
                  :label=" $t('users.companyId')"
                  label-for="identificationNumber">
                <b-form-input
                    id="identificationNumber"
                    v-model="juridicalInfo.identificationNumber"
                    :disabled="isMyProfile && userData.role === 'farmer'"
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    trim/>
              </b-form-group>
            </validation-provider>
            <!-- Juridical Info: Juridical type-->
            <validation-provider class="mr-2"
                                 v-slot="{errors, valid, dirty }"
                                 name="Juridical Type"
                                 rules="required">
              <b-form-group
                  :label=" $t('users.legalEntityType')"
                  label-for="juridicalType">
                <b-form-select id="juridicalType"
                               v-model="juridicalInfo.juridicalType"
                               :disabled="isMyProfile && userData.role === 'farmer'"
                               :options="juridicalTypeOptions"
                               :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                >
                </b-form-select>
              </b-form-group>
            </validation-provider>
          </b-row>
        </b-card>

        <!-- Card: Farmer Description -->
        <b-card v-if="userData.role === 'farmer'">
          <!-- Header: Description -->
          <div class="d-flex mb-2">
            <feather-icon
                icon="UserIcon"
                size="19"
            />
            <h4 class="mb-0 ml-50">
              {{  $t('users.aboutFarmer') }}
            </h4>
          </div>

          <b-tabs>
            <b-tab :title=" $t('global.geo')" active>
              <!-- Form: Description -->
              <text-editor v-if="description_ka !== null" :editor="description_ka" @update="updateDescriptionValue_ka"/>
            </b-tab>
            <b-tab :title=" $t('global.eng')">
              <!-- Form: Description -->
              <text-editor v-if="description_en !== null" :editor="description_en" @update="updateDescriptionValue_en"/>
            </b-tab>
          </b-tabs>

        </b-card>

        <!-- Card: Contact Info -->
        <b-card>
          <!-- Header: Contact Information -->
          <div class="d-flex mb-2 align-items-center justify-content-between">

            <div class="d-flex">
              <feather-icon
                  icon="PhoneIcon"
                  size="19"
              />
              <h4 class="mb-0 ml-50">
                {{  $t('users.contactInfo') }}
              </h4>
            </div>

            <div class="d-flex" v-if="(is_admin || is_consul) && userData.role === 'farmer'">
              <!-- Save selected phone number-->
              <b-button :disabled="selected_phone_number === userData.phoneNumber"
                        variant="primary"
                        class="ml-2 d-flex"
                        @click="saveSelectedPhoneNumber"
              >
                <feather-icon
                    icon="EditIcon"
                    class="d-block mr-1"
                />
                <span class="font-weight-bold d-none d-md-block">{{  $t('users.saveSelectedPhoneNumber') }}</span>
              </b-button>
              <!-- Save selected Phone Number-->
              <!-- Add Phone Number-->
              <b-button v-if="!is_consul"
                        variant="primary"
                        class="ml-2 d-flex"
                        @click="isAddPhoneNumberModalActive = true"
              >
                <feather-icon
                    icon="PlusIcon"
                    class="d-block mr-1"
                />
                <span class="font-weight-bold d-none d-md-block">{{  $t('global.add') }} {{  $t('users.phoneNumber') }}</span>
              </b-button>
              <!-- Add Phone Number-->
            </div>
          </div>

          <!-- Form: Contact Information -->
          <b-row class="d-flex align-items-center justify-content-start">
            <b-col cols="12"
                   md="3"
                   lg="4">
              <!-- Email -->
              <validation-provider
                  v-slot="{errors, valid, dirty }"
                  :name=" $t('global.email')"
                  class="mr-2"
                  :rules="''">
                <b-form-group
                    :label=" $t('global.email')"
                    label-for="email">
                  <b-form-input
                      id="email"
                      v-model="email"
                      :disabled="isMyProfile && userData.role === 'farmer'"
                      :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                      trim/>
                </b-form-group>
              </validation-provider>
            </b-col>

            <b-col cols="12"
                   md="3"
                   lg="4">

              <!-- Workspace Phone Number -->
              <validation-provider v-if="userData.role === 'callCenterManager'"
                                   name="Workspace Phone Number"
                                   class="mr-2">
                <b-form-group
                    :label=" $t('users.extensionNumber')"
                    label-for="workspace_phone">
                  <b-form-input
                      id="workspace_phone"
                      v-model="workspacePhoneNumber"
                      :disabled="isMyProfile && userData.role === 'farmer'"
                      trim/>
                </b-form-group>
              </validation-provider>
            </b-col>

          </b-row>
          <!-- Form: Phone Form -->
          <b-row class="">
            <!-- Field: Mobile -->
            <b-col
                cols="12"
                md="3"
                lg="4"
            >
              <!-- Phone Numbers -->
              <div class="phone-numbers-container demo-inline-spacing mb-3" v-if="userData.role === 'farmer' ">
                <label>{{  $t('users.phoneNumber') }}</label>
                <template v-if="phoneNumbers.length > 0">
                  <b-form-radio v-for="phone in phoneNumbers"
                                :key="phone.id"
                                v-model="selectedPhoneNumberId"
                                plain
                                name="some-radios3"
                                class="w-100"
                                :value="phone.id"
                  >
                    <phone-number-card
                        :phone-number-item="{title: phone.number, i: phone.id, selected: phone.selected}"
                        :is-legal-entity="isLegalEntity"
                        type="number"
                        @update="updatePhoneNumber"
                        @delete="deletePhoneNumber"
                    />
                  </b-form-radio>
                </template>

              </div>

              <!-- Phone Number -->
              <validation-provider v-else
                                   v-slot="{errors, valid, dirty }"
                                   name="Phone Number"
                                   :rules="'required'">
                <b-form-group
                    :label=" $t('users.phoneNumber')"
                    label-for="phone_number">
                  <b-form-input
                      id="phone_number"
                      v-model="phoneNumber"
                      :state="dirty ? validate_phone_number : null"
                      trim/>
                </b-form-group>
              </validation-provider>
            </b-col>
          </b-row>
        </b-card>

        <!-- Card: Address -->
        <b-card v-if="userData.role === 'farmer' || userData.role === 'consul'">
          <!-- Header: Address -->
          <div class="d-flex mb-2 align-items-center justify-content-between">
            <div class="d-flex">
              <feather-icon
                  icon="MapPinIcon"
                  size="19"
              />
              <h4 class="mb-0 ml-50">
                {{  $t('address.address') }}
              </h4>
            </div>
            <div class="d-flex" v-if="is_admin || is_consul && userData.role === 'farmer'">
              <!-- Save selected address-->
              <b-button v-if="is_consul || userData.address"
                        :disabled="selectedAddress === userData.address.id"
                        variant="primary"
                        class="ml-2 d-flex"
                        @click="saveSelectedAddress"
              >
                <feather-icon
                    icon="EditIcon"
                    class="d-block mr-1"
                />
                <span class="font-weight-bold d-none d-md-block">{{ $t('users.saveSelectedAddress') }}</span>
              </b-button>
              <!-- Save selected address-->
              <!-- Add address-->
              <b-button v-if="!is_consul"
                        variant="primary"
                        class="ml-2 d-flex"
                        @click="isAddAddressModalActive = true"
              >
                <feather-icon
                    icon="PlusIcon"
                    class="d-block mr-1"
                />
                <span class="font-weight-bold d-none d-md-block">{{$t('global.add') }} {{$t('address.address') }}</span>
              </b-button>
              <!-- Add address-->
            </div>
          </div>

          <b-form-radio-group v-model="selectedAddress"
                              :options="addresses"
          />
        </b-card>

        <!-- Card: Vehicle -->
        <b-card v-if="userData.role === 'courier' || userData.role === 'logisticsManager'">
          <!-- Header: Vehicle -->
          <div class="d-flex mb-2">
            <feather-icon
                icon="TruckIcon"
                size="19"
            />
            <h4 class="mb-0 ml-50">
              {{ $t('users.vehicleInformation') }}
            </h4>
          </div>

          <!-- Form: Vehicle -->
          <b-row class="mt-1 pl-2 pr-2 d-flex align-items-center justify-content-start">

            <!-- license Number -->
            <validation-provider class="mr-2"
                                 v-slot="{}"
                                 name="license Number"
                                 rules="">
              <b-form-group
                  :label="$t('users.licenseNumber')"
                  label-for="licenseNumber">
                <b-form-input
                    id="licenseNumber"
                    v-model="licenseNumber"
                    trim/>
              </b-form-group>
            </validation-provider>

            <!-- Vehicle Manufacturer -->
            <validation-provider class="mr-2"
                                 v-slot="{errors, valid, dirty }"
                                 name="Vehicle Manufacturer"
                                 rules="">
              <b-form-group
                  :label="$t('users.vehicleBrand')"
                  label-for="manufacturer">
                <b-form-input
                    id="manufacturer"
                    v-model="vehicle.manufacturer"
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    trim/>
              </b-form-group>
            </validation-provider>

            <!-- Vehicle Model -->
            <validation-provider class="mr-2"
                                 v-slot="{errors, valid, dirty }"
                                 name="Vehicle Model"
                                 rules="">
              <b-form-group
                  :label="$t('users.vehicleModel')"
                  label-for="model">
                <b-form-input
                    id="model"
                    v-model="vehicle.model"
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    trim/>
              </b-form-group>
            </validation-provider>

            <!-- Vehicle license Plate -->
            <validation-provider class="mr-2"
                                 v-slot="{errors, valid, dirty }"
                                 name="Vehicle license Plate"
                                 rules="">
              <b-form-group
                  :label="$t('users.vehicleRegistrationNumber')"
                  label-for="licensePlate">
                <b-form-input
                    id="licensePlate"
                    v-model="vehicle.licensePlate"
                    :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                    trim/>
              </b-form-group>
            </validation-provider>
          </b-row>
        </b-card>

        <!-- Card: Bank Requisites -->
        <b-card v-if="userData.role === 'farmer'">
          <!-- Header: Bank Requisites -->
          <div class="d-flex mb-2">
            <feather-icon
                icon="CreditCardIcon"
                size="19"
            />
            <h4 class="mb-0 ml-50">
              {{ $t('users.requisite') }}
            </h4>
          </div>

          <!-- Form: Requisites -->
          <b-row class="mt-1">

            <!-- Field: Bank requisites -->
            <b-col
                cols="12"
                md="6"
                lg="4"
            >

              <!-- Bank Account Number -->
              <validation-provider
                  v-slot=""
                  class="mt-1"
                  name="bankAccountNumber"
                  :rules="isCash ? '' : ''">
                <b-form-group
                    :label="$t('users.bankAccountNumber')"
                    label-for="bankAccountNumber">
                  <b-form-input
                      id="bankAccountNumber"
                      v-model="bankAccountNumber"
                      :disabled="isCash || (isMyProfile && userData.role === 'farmer')"
                      trim/>
                </b-form-group>
                <b-form-checkbox v-model="isCash"
                                 checked="true" class="pb-1"
                                 :disabled="isMyProfile && userData.role === 'farmer'"
                                 name="check-button"
                                 switch
                                 inline>
                  <span v-if="!isCash">{{ $t('global.card') }}</span>
                  <span v-else>{{ $t('global.cash') }}</span>
                </b-form-checkbox>

              </validation-provider>
            </b-col>
          </b-row>
        </b-card>

        <!-- Card: Save Edited Info -->
        <b-card>
          <div class="d-flex justify-content-end">
            <!-- edit buttons -->
            <b-button
                variant="primary"
                class="ml-4"
                :disabled="isInvalid(errors) || disableEdit"
                @click="editUser"
            >
              <feather-icon
                  icon="EditIcon"
                  class="d-block d-md-none"
              />
              <span class="font-weight-bold d-none d-md-block">{{ $t('global.save') }}</span>
            </b-button>
            <!-- edit buttons -->
          </div>

        </b-card>

      </b-form>
    </validation-observer>

    <add-address-modal
        :regions-list="regionsList"
        :villages-list="villagesList"
        :municipalities-list="municipalitiesList"
        :is-add-address-modal-active.sync="isAddAddressModalActive"
        @add="addAddress"
        @hide="hideModal"
        @get-villages="fetchVillages"
        @get-municipalities="fetchMunicipalities"/>

    <add-phone-number-modal
        :is-add-phone-number-modal-active.sync="isAddPhoneNumberModalActive"
        :is-legal-entity="isLegalEntity"
        @add="addPhoneNumber"
        @hide="hideModal"/>
  </div>
</template>

<script>
/* eslint-disable */

import {onUnmounted, ref} from "@vue/composition-api";
import store from "@/store";
import userStoreModule from "@/views/apps/user/userStoreModule";
import router from "@/router";
import {
  BCard,
  BImg,
  BCardImg,
  BNavbar,
  BNavbarToggle,
  BCollapse,
  BTabs,
  BNavItem,
  BButton,
  BCol,
  BRow,
  BForm,
  BFormGroup,
  BFormInput,
  BFormRadioGroup,
  BFormCheckboxGroup,
  BFormInvalidFeedback,
  BFormCheckbox, BFormSelect,
  BInputGroup,
  BFormRadio,
  BFormFile,
  BAvatar,
  BMedia,
  BTab
} from 'bootstrap-vue'
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import vSelect from "vue-select";
import flatPickr from 'vue-flatpickr-component'
import Ripple from 'vue-ripple-directive'
import {required, alphaNum, email} from '@validations'
import useUsersList from "@/views/apps/user/users-list/useUsersList";
import FormSelectStandard from "@/views/forms/form-element/form-select/FormSelectStandard";
import AddAddressModal from "@/views/apps/user/user-profile/components/AddAddressModal";
import AddPhoneNumberModal from "@/views/apps/user/user-profile/components/AddPhoneNumberModal";
import {ValidationProvider, ValidationObserver} from 'vee-validate'
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import productStoreModule from "@/views/apps/products/productStoreModule";
import Certificates from "@/views/apps/user/user-profile/components/Certificates";
import PhoneNumberCard from "@/views/apps/user/user-profile/components/PhoneNumberCard";
import ImageUpload from "@/views/apps/products/components/ImageUpload";
import TextEditor from "@/views/components/editor/TextEditor";

export default {
  name: "EditUserProfile",
  components: {
    TextEditor,
    ImageUpload,
    PhoneNumberCard,
    Certificates,
    AddPhoneNumberModal,
    AddAddressModal,
    FormSelectStandard,
    HorizontalNavbar,
    BCard,
    BTabs,
    BButton,
    BNavItem,
    BNavbar,
    BNavbarToggle,
    BCollapse,
    BImg,
    BCardImg,
    vSelect,
    flatPickr,
    BCol,
    BRow, BForm, BFormGroup, BFormInput, BFormRadioGroup, BFormCheckboxGroup,
    BFormInvalidFeedback,
    BFormCheckbox,
    BFormSelect,
    BInputGroup,
    BFormRadio,
    BFormFile,
    BMedia,
    BAvatar,
    BTab,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },

  data() {
    return {
      disableEdit: false,
      required,
      alphaNum,
      loader: false,
      userData: null,
      isEditUserSidebarActive: false,
      isAddAddressModalActive: false,
      isAddPhoneNumberModalActive: false,
      role: '',
      sidebarFields: {},
      requestPath: '',
      firstName: '',
      firstName_en: '',
      lastName: '',
      lastName_en: '',
      userName: '',
      identity: '',
      email: '',
      phoneNumber: '',
      workspacePhoneNumber: '',
      password: '',
      confirmPassword: '',
      isLegalEntity: false,
      isCash: false,
      selectedAddress: '',
      selectedPhoneNumberId: '',
      addresses: [],
      phoneNumbers: [],
      address: {
        region: '',
        regionText: '',
        city: '',
        cityText: '',
        village: '',
        address: '',
        id: ''
      },
      cityText: '',
      juridicalInfo: {
        commercialName: '',
        commercialName_en: '',
        juridicalName: '',
        identificationNumber: '',
        juridicalType: '',
      },
      responsibleUser: '',
      bankAccountNumber: '',
      licenseNumber: '',
      vehicle: {
        manufacturer: '',
        model: '',
        licensePlate: ''
      },
      selectedStickers: {},
      selectedStickersArray: [],
      groupedCertificates: [],
      stickers: [],
      certificates: [],
      description_ka: null,
      description_en: null,
      personalInfo: {
        profileImage: null,
        coverImage: null,
        videoLink: '',
        translations: [
          {
            languageCode: 'ka',
            text: ''
          },
          {
            languageCode: 'en',
            text: ''
          },
        ]
      },
      profilePictureName: '',
      coverImageName: '',
      juridicalTypeOptions: [
        {value: 'NotSet', text: this.$i18n.t('global.choose')},
        {value: 'LimitedPartnership', text: this.$i18n.t('legalEntityTypes.jointAndSeveralLiabilityCompany')},
        {value: 'LimitedLiability', text: this.$i18n.t('legalEntityTypes.limitedLiabilityCompany')},
        {value: 'Cooperative', text: this.$i18n.t('legalEntityTypes.cooperative')},
        {value: 'Individual', text: this.$i18n.t('legalEntityTypes.individualEntrepreneur')},
        {value: 'Small', text: this.$i18n.t('legalEntityTypes.soleProprietorship')},
      ],

      profileImage: {},
      coverImage: {},
      staticEnvValue: '',

      regionsList: [],
      villagesList: [],
      municipalitiesList: [],
      consulsList: [],
      payloadCertificates: [],

      userId: null,
      loggedUserRole: '',
      file: null,

      Selected: '',
      isMyProfile: false,
    }
  },

  watch: {
    selectedStickers: {
      // This will let Vue know to look inside the array
      deep: true,

      // We have to move our method to a handler field
      handler(newVal) {
        if (this.userData.role === 'farmer') {
          this.selectedStickersArray = []
          Object.keys(newVal).forEach(stickerId => {
            if (newVal[stickerId]) {
              let selectedSticker = this.stickers.find(item => item.id == stickerId)
              this.selectedStickersArray.push(selectedSticker)
              selectedSticker['certificates'] = []
              this.groupedCertificates.push(selectedSticker)
            }
          })
        }
      }
    }
  },

  mounted() {
    this.disableEdit = true;
    setTimeout(() => {
      this.disableEdit = false;
    }, 2000)
    this.userId = router.currentRoute.params.id ? router.currentRoute.params.id : JSON.parse(localStorage.getItem('userInfo')).unique_name
    this.loggedUserRole = JSON.parse(localStorage.getItem('userInfo'))['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    this.isMyProfile = router.currentRoute.params.id === JSON.parse(localStorage.getItem('userInfo')).unique_name
    if (!this.isMyProfile) {
      this.fetchUserProfile().then((response) => {
        if (this.role === 'farmer') {
          let fetchRegionsPromise = this.fetchRegions()
          let fetchStickersPromise = this.fetchStickers()
          let fetchPersonalInfoPromise = this.fetchPersonalInfo()
          let fetchUserAddressesPromise = this.fetchUserAddresses(this.userId)
          let fetchConsulsPromise = this.loggedUserRole !== 'consul' ? this.fetchConsuls() : null

          Promise.all([fetchRegionsPromise, fetchStickersPromise, fetchPersonalInfoPromise, fetchUserAddressesPromise, fetchConsulsPromise])
              .then(() => {
                    this.updateUserInfo(this.userData);
                  }
              )
        } else {
          this.fetchRegions();
          this.updateUserInfo(this.userData);
        }
      });
    } else {
      this.fetchMyProfile().then((response) => {
        if (this.role === 'farmer') {
          let fetchRegionsPromise = this.fetchRegions()
          let fetchStickersPromise = this.fetchStickers()
          // let fetchPersonalInfoPromise = this.fetchPersonalInfo()
          let fetchUserAddressesPromise = this.fetchUserAddresses(this.userId)
          // let fetchConsulsPromise = this.loggedUserRole !== 'consul' ? this.fetchConsuls() : null

          Promise.all([fetchRegionsPromise, fetchStickersPromise, fetchUserAddressesPromise])
              .then(() => {
                    this.updateUserInfo(this.userData);
                  }
              )
        } else {
          this.fetchRegions();
          this.updateUserInfo(this.userData);
        }
      });
    }
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
  },

  computed: {
    validate_username() {
      if (this.userName && this.userName.length === 0) return null
      return new RegExp('^[a-zA-Z0-9-_.@]{6,100}$').test(this.userName)
    },
    validate_license_number() {
      if (this.licenseNumber && this.licenseNumber.length === 0) return null
      return new RegExp('^[a-zA-Z0-9-_.]{6,100}$').test(this.licenseNumber)
    },
    validate_bank_account_number() {
      if (this.isCash) return true;
      else if (this.bankAccountNumber && this.bankAccountNumber.length === 0) return null
      return new RegExp('^[a-zA-Z0-9-_.]{6,100}$').test(this.bankAccountNumber)
    },
    validate_phone_number() {
      // if (this.phoneNumber.length === 0) return null
      if (this.isLegalEntity) return new RegExp('^[0-9]{9,10}$').test(this.phoneNumber)
      return new RegExp('^[0-9]{9}$').test(this.phoneNumber)
      // return new RegExp('^[0-9]{1,100}$').test(this.phoneNumber)
    },
    validate_identification_number() {
      if (!this.isLegalEntity) return true
      if (this.juridicalInfo.identificationNumber.length === 0) return null
      return new RegExp('^[0-9]{1,100}$').test(this.juridicalInfo.identificationNumber)
    },
    selected_phone_number() {
      let phoneObj = this.phoneNumbers.find(a => a.id === this.selectedPhoneNumberId)
      return phoneObj ? phoneObj.number : ''
    },
    is_admin() {
      return localStorage.getItem('role') === 'admin'
    },
    is_consul() {
      return localStorage.getItem('role') === 'consul'
    },
    cover_image() {
      return process.env.VUE_APP_STATIC_RESOURCES_URL + '/' + this.personalInfo.coverImage
    },
    profile_image() {
      return process.env.VUE_APP_STATIC_RESOURCES_URL + '/' + this.personalInfo.profileImage
    }
  },

  methods: {
    fetchUserProfile() {
      return store.dispatch('app-user/fetchUser', {id: this.userId})
          .then(response => {
            this.userData = response.data
            this.role = this.userData.role
            this.sidebarFields['id'] = this.userData.id;
            this.sidebarFields = this.userData
            this.requestPath = this.requestUrls[this.role].edit
          })
          .catch(error => {
            console.log(error)
          })
    },

    fetchMyProfile() {
      return store.dispatch('app-user/fetchProfile')
          .then(response => {
            this.userData = response
            this.role = this.userData.role
            this.sidebarFields['id'] = this.userData.id;
            this.sidebarFields = this.userData
            this.requestPath = this.requestUrls[this.role].edit
            this.updateUserInfo(response);
          })
          .catch(error => {
            console.log(error)
          })
    },

    fetchPersonalInfo() {
      return store.dispatch('app-user/fetchPersonalInfo', {id: this.userId})
          .then(response => {
            this.personalInfo = response
            this.coverImage = {
              name: response.coverImage
            }
            this.profileImage = {
              name: response.profileImage
            }
          })
          .catch(error => {
            console.log(error)
          })
    },

    fetchStickers() {
      return store.dispatch('app-product/fetchStickers')
          .then((response) => {
            this.stickers = response.data
          })
    },

    editPersonalInfo() {
      store.dispatch('app-user/fetchPersonalInfo', {id: this.userId, personalInfo: this.personalInfo})
          .then(response => {
          })
          .catch(error => {
            console.log(error)
          })
    },

    uploadImage(file) {
      return store.dispatch('app-user/uploadImage', {file: file})
          .then(response => {
            this.profilePictureName = this.profilePicture ? response.data.name.key : this.profilePictureName
            this.coverImageName = this.coverImage ? response.data.name.key : this.coverImageName
          })
          .catch(error => {
          })
    },

    updateCertificates(item) {
      if (item.id == 0) {
        this.payloadCertificates.push(item)
      } else {
        let oldCertificateIndex = this.payloadCertificates.findIndex(el => el.id === item.id)
        this.payloadCertificates.splice(oldCertificateIndex, 1, item)
      }
    },

    deleteCertificate(item) {
      let oldCertificateIndex = this.payloadCertificates.findIndex(el => el.id === item.id)
      this.payloadCertificates.splice(oldCertificateIndex, 1)
    },

    publishFarmer(payload) {
      this.loader = true;
      store.dispatch('app-user/publishFarmer', {id: payload.id, value: payload.status})
          .then((response) => {
            this.loader = false;
          })
    },

    fetchUserAddresses(id) {
      // this.loader = true;opp
      return store.dispatch('app-user/fetchUserAddresses', {id: id})
          .then((response) => {
            this.addresses = [];
            response.data.forEach(a => {
              this.addresses.push({
                id: a.id,
                value: a.id,
                html: `<div><p><b>${this.$i18n.t('address.region')}</b>: <span>${a.region}</span></p> </div>
                      <div><p><b>${this.$i18n.t('address.municipality')}</b>: <span>${a.municipality}</span></p> </div>
                      <div><p><b>${this.$i18n.t('address.village')}</b>: <span>${a.village}</span></p> </div>
                      <div><p><b>${this.$i18n.t('address.address')}</b>: <span>${a.address}</span></p> </div>
                      `,
                region: a.regionId,
                address: a.address,
                regionText: a.region,
                cityText: a.municipality,
                village: a.village,
                villageId: a.villageId,
                municipalityId: a.municipalityId
              })
              if (a.selected) this.selectedAddress = a.id
            })
          })
    },

    fetchUserPhoneNumbers(id) {
      // this.loader = true;
      store.dispatch('app-user/fetchUserPhoneNumbers', {id: id})
          .then((response) => {
            this.phoneNumbers = [];
            this.$nextTick(() => {
              response.data.forEach(a => {
                this.phoneNumbers.push({
                  id: a.id,
                  value: a.id,
                  number: a.number,
                  selected: a.selected,
                  html: `<div><span>${a.number}</span></p> </div>`,
                })
                if (a.selected) this.selectedPhoneNumberId = a.id
              })
            })
          })
    },

    updateDescriptionValue_ka(description) {
      this.description_ka = description
    },

    updateDescriptionValue_en(description) {
      this.description_en = description
    },

    updateUserInfo(newVal) {
      if (newVal.role === 'farmer') {
        let georgian_names = newVal.physicalNames ? newVal.physicalNames.find(a => a.languageCode === 'ka') : {}
        let english_names = newVal.physicalNames ? newVal.physicalNames.find(a => a.languageCode === 'en') : {}

        this.firstName = newVal.userType === "Juridical" ? newVal.juridicalInfo.directorFirstName : georgian_names ? georgian_names.firstName : ''
        this.firstName_en = english_names ? english_names.firstName : ''
        this.lastName = newVal.userType === "Juridical" ? newVal.juridicalInfo.directorLastName : georgian_names ? georgian_names.lastName : ''
        this.lastName_en = english_names ? english_names.lastName : ''
      } else {
        this.firstName = newVal.firstName;
        this.lastName = newVal.lastName;
      }

      this.userName = newVal.userName;
      this.identity = newVal.identity;
      this.email = newVal.email;
      this.phoneNumber = newVal.phoneNumber;
      this.workspacePhoneNumber = newVal.workspacePhoneNumber;
      this.password = newVal.password;
      this.confirmPassword = newVal.confirmPassword;
      this.isCash = newVal.enableCash === undefined ? true : newVal.enableCash;
      this.isLegalEntity = newVal.userType === 'Juridical';
      let commercialNames_en = newVal.juridicalInfo ? newVal.juridicalInfo.juridicalNames.find(a => a.languageCode === 'en') : {}
      let commercialNames_ka = newVal.juridicalInfo ? newVal.juridicalInfo.juridicalNames.find(a => a.languageCode === 'ka') : {}
      this.juridicalInfo = newVal.juridicalInfo ? {
        directorFirstName: newVal.directorFirstName,
        directorLastName: newVal.directorLastName,
        commercialName: commercialNames_ka ? commercialNames_ka.commercialName : '',
        commercialName_en: commercialNames_en ? commercialNames_en.commercialName : '',
        juridicalName: newVal.juridicalInfo.juridicalName,
        identificationNumber: newVal.juridicalInfo.identificationNumber,
        juridicalType: newVal.juridicalInfo.juridicalType,
      } : {}
      this.bankAccountNumber = newVal.bankAccountNumber;

      let stickers = {};
      newVal.stickers ? newVal.stickers.forEach(item => {
        stickers[item.id] = true
      }) : {}
      this.selectedStickers = stickers
      this.selectedStickersArray = newVal.stickers
      this.groupedCertificates = newVal.groupedCertificates
      this.payloadCertificates = []
      newVal.groupedCertificates ? newVal.groupedCertificates.forEach(el => {
        el.certificates.forEach(item => {
          let copyItem = {}
          copyItem['stickerId'] = el.id
          copyItem['image'] = el.image
          copyItem['id'] = item.id
          copyItem['title'] = item.title
          copyItem['file'] = item.file
          copyItem['translations'] = item.translations
          this.payloadCertificates.push(copyItem)
        })
      }) : ''
      this.certificates = newVal.certificates;
      newVal.stickers ? newVal.stickers.forEach(item => {
        if (!this.groupedCertificates.filter(el => el.id == item.id).length) {
          item['certificates'] = []
          this.groupedCertificates.push(item)
        }
      }) : {}
      this.responsibleUser = newVal.responsibleUser;
      this.licenseNumber = newVal.licenseNumber;
      this.vehicle = newVal.vehicle ? {
        manufacturer: newVal.vehicle.manufacturer,
        model: newVal.vehicle.model,
        licensePlate: newVal.vehicle.licensePlate
      } : {}
      this.address = newVal.address ? {
        region: newVal.address.regionId,
        address: newVal.address.address,
        id: newVal.address.id,
        regionText: this.regionsList.find(a => a.id == newVal.address.regionId),
      } : {}
      let englishDescription = this.personalInfo.translations?.find(a => a.languageCode === 'en')
      let georgianDescription = this.personalInfo.translations?.find(a => a.languageCode === 'ka')
      this.description_en = englishDescription ? englishDescription.text : ''
      this.description_ka = georgianDescription ? georgianDescription.text : ''
      let regionId = newVal.address ? newVal.address.regionId : ''
      let municipalityId = newVal.address ? newVal.address.municipalityId : ''
      this.fetchMunicipalities(regionId).then(() => {
        this.fetchVillages({municipalityId: municipalityId, regionId: regionId}).then(() => {
          this.fetchUserAddresses(this.userId);
          this.fetchUserPhoneNumbers(this.userId);
        });

      });
    },

    fetchRegions() {
      return store.dispatch('app-user/fetchRegions')
          .then((response) => {
            this.regionsList = this.regionsList.concat(response.data.data)
          })
    },

    fetchConsuls() {
      return store.dispatch('app-user/fetchUsers', {role: 'Consul', take: -1})
          .then((response) => {
            this.consulsList = response.data.map((a) => {
              return {title: a.firstName + ' ' + a.lastName + ' - ' + a.userName, id: a.id}
            })
          })
    },

    fetchVillages(data) {
      return store.dispatch('app-user/fetchVillages', {region_id: data.regionId, municipality_id: data.municipalityId})
          .then((response) => {
            if (data.regionId) this.villagesList = response.data.data
            // else this.villagesFilteringOptions = this.villagesFilteringOptions.concat(response.data.data)

            this.address.village = this.villagesList ? this.villagesList.find(a => a.id === this.userData.address.villageId) : ''
          })
    },

    fetchMunicipalities(id) {
      return store.dispatch('app-user/fetchMunicipalities', {region_id: id})
          .then((response) => {
            if (id) this.municipalitiesList = response.data.data
            // else this.municipalitiesFilteringOptions = this.municipalitiesFilteringOptions.concat(response.data.data)
            this.address.cityText = this.municipalitiesList.find(a => a.id == this.userData.address.municipalityId)
          })
    },

    editUser() {
      this.disableEdit = true;
			setTimeout(() => {
				this.disableEdit = false;
			}, 1000)
      let selectedAddressObj = this.addresses.find(a => a.id === this.selectedAddress)
      let stickerIds = [];
      for (const [key, value] of Object.entries(this.selectedStickers)) {
        value ? stickerIds.push(key) : ''
      }
      this.payloadCertificates = this.payloadCertificates.filter(el => stickerIds.includes(el.stickerId.toString()))
      let payload = {
        id: this.userId,
        physicalNames: this.userData.role === 'farmer' ? [
          {
            languageCode: "ka",
            firstName: this.firstName,
            lastName: this.lastName
          },
          {
            languageCode: "en",
            firstName: this.firstName_en,
            lastName: this.lastName_en
          },
        ] : [],
        firstName: this.userData.role !== 'farmer' ? this.firstName : '',
        lastName: this.userData.role !== 'farmer' ? this.lastName : '',
        // lastName: this.lastName,
        userName: this.userName,
        identity: this.identity,
        email: this.email,
        phoneNumber: this.phoneNumber,
        workspacePhoneNumber: this.workspacePhoneNumber,
        password: this.password,
        confirmPassword: this.confirmPassword,
        responsibleUserId: this.responsibleUser ? this.responsibleUser.id : '',
        userType: this.isLegalEntity ? 'Juridical' : 'Physical',
        address: {
          regionId: this.address.regionText ? this.address.regionText.id : '',
          municipalityId: selectedAddressObj ? selectedAddressObj.municipalityId : '',
          villageId: selectedAddressObj ? selectedAddressObj.villageId : '',
          address: this.address.address,
          id: this.address.id,
        },
        juridicalInfo: {
          directorFirstName: this.firstName,
          directorLastName: this.lastName,
          // commercialName: this.juridicalInfo.commercialName,
          juridicalName: this.juridicalInfo.juridicalName,
          identificationNumber: this.juridicalInfo.identificationNumber,
          juridicalType: this.juridicalInfo.juridicalType,
          juridicalNames: [
            {
              languageCode: "ka",
              commercialName: this.juridicalInfo.commercialName
            },
            {
              languageCode: "en",
              commercialName: this.juridicalInfo.commercialName_en
            },
          ]
        },
        bankAccountNumber: this.isCash ? '' : this.bankAccountNumber,
        enableCash: this.isCash,
        licenseNumber: this.licenseNumber,
        certificates: this.payloadCertificates,
        // stickerIds: Object.keys(this.selectedStickers),
        stickerIds: stickerIds,
        vehicle: {
          manufacturer: this.vehicle.manufacturer,
          model: this.vehicle.model,
          licensePlate: this.vehicle.licensePlate
        },
        personalInfo: {
          // profileImage: this.profilePicture ? this.profilePictureName : this.personalInfo.profileImage,
          profileImage: this.profileImage.name,
          // coverImage: this.coverImage ? this.coverImageName : this.personalInfo.coverImage,
          coverImage: this.coverImage.name,
          videoLink: this.personalInfo.videoLink,
          translations: [
            {
              languageCode: 'ka',
              text: this.description_ka,
            },
            {
              languageCode: 'en',
              text: this.description_en,
            },
          ]
        },
      };
      store.dispatch(this.requestPath, payload)
          .then((response) => {
            this.fetchPersonalInfo().then(() => {
              if (router.currentRoute.params.id) {
                this.fetchUserProfile();
              } else {
                this.fetchMyProfile();
              }
              this.updateUserInfo(response.data)
            })
            this.fetchUserAddresses(this.userId);
            this.toast('success', 'მონაცემები წარმატებით განახლდა', 'UserIcon')
          }).catch((error) => {
            alert(error.response.data)
            this.toast('danger', 'დაფიქსირდა შეცდომა', 'UserIcon')
          }
      )
    },

    saveSelectedAddress() {
      store.dispatch('app-user/saveSelectedAddress', {
        user_id: this.userId,
        address_id: this.selectedAddress
      })
          .then((response) => {
            this.toast('success', 'მისამართი განახლებულია', 'SaveIcon')
            this.fetchUserProfile();
          })
    },

    addAddress(payload) {
      store.dispatch('app-user/addAddress', payload)
          .then((response) => {
            this.toast('success', 'მისამართი წარმატებით დაემატა', 'UserIcon')
            this.isAddAddressModalActive = false;
            this.fetchUserProfile();
            this.fetchUserAddresses(this.userId)
          })
    },

    saveSelectedPhoneNumber() {
      store.dispatch('app-user/saveSelectedPhoneNumber', {
        user_id: this.userId,
        phone_id: this.selectedPhoneNumberId
      })
          .then((response) => {
            this.toast('success', 'ტელეფონის ნომერი განახლებულია', 'SaveIcon')
            // this.fetchUserProfile();
            this.fetchUserPhoneNumbers(this.userId);
          })
    },

    updatePhoneNumber(payload) {
      store.dispatch('app-user/updatePhoneNumber', {
        userId: this.userId,
        data: payload
      })
          .then(() => {
            this.toast('success', 'ტელეფონის ნომერი განახლებულია', 'SaveIcon')
            this.fetchUserPhoneNumbers(this.userId);
          })
    },

    deletePhoneNumber(payload) {
      store.dispatch('app-user/deletePhoneNumber', {
        userId: this.userId,
        phoneId: payload.id
      })
          .then((response) => {
            this.toast('danger', 'ტელეფონის ნომერი წაშლილია', 'DeleteIcon')
            // this.fetchUserProfile();
            this.fetchUserPhoneNumbers(this.userId);
          })
    },

    addPhoneNumber(phone) {
      let payload = {
        user_id: this.userId,
        token: localStorage.getItem('token'),
        number: phone
      }
      store.dispatch('app-user/addPhoneNumber', payload)
          .then((response) => {
            this.toast('success', 'ტელეფონის ნომერი წარმატებით დაემატა', 'UserIcon')
            this.isAddPhoneNumberModalActive = false;
            this.fetchUserPhoneNumbers(this.userId);
          })
    },

    addCoverImage(name) {
      this.coverImage = {
        name: name
      }
    },

    addProfileImage(name) {
      this.profileImage = {
        name: name
      }
    },

    hideModal({id}) {
      this.$refs['add-address'].hide();
    },

    toast(variant, title, icon) {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: title,
          icon: icon,
          variant: variant,
        },
      })
    },

    isInvalid(errors) {
      for (const [key, value] of Object.entries(errors)) {
        if (value.length > 0) return true
      }
      let isJuridicalInfoValid = this.isLegalEntity ? (this.juridicalInfo.juridicalName !== ''
          && this.juridicalInfo.identificationNumber !== ''
          && this.juridicalInfo.juridicalType !== 'NotSet') : true

      return !(this.validate_username
          && this.validate_bank_account_number
          && this.validate_identification_number
          && this.validate_phone_number
          && isJuridicalInfoValid);
    },

    goBack() {
      if (this.isMyProfile) router.push({name: 'user-profile'})
      else router.push({name: 'user-profile', params: {id: this.userId}})
    },
  },

  setup(props) {
    const USER_APP_STORE_MODULE_NAME = 'app-user'
    const PRODUCT_APP_STORE_MODULE_NAME = 'app-product';


    // Register module
    if (!store.hasModule(PRODUCT_APP_STORE_MODULE_NAME)) store.registerModule(PRODUCT_APP_STORE_MODULE_NAME, productStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PRODUCT_APP_STORE_MODULE_NAME)) store.unregisterModule(PRODUCT_APP_STORE_MODULE_NAME)
    });

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME)) store.unregisterModule(USER_APP_STORE_MODULE_NAME)
    })

    const genderOptions = [
      {text: 'აირჩიეთ', value: 'NotSet'},
      {text: 'მამრობითი', value: 'male'},
      {text: 'მდედრობითი', value: 'female'},
    ]

    const {
      editFieldsDict,
      requestUrls
    } = useUsersList(props)

    return {
      editFieldsDict,
      genderOptions,
      requestUrls,
    }

  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-profile.scss';

.profile-header.container {
  .card-body {
    align-items: center;
    justify-content: space-between;
    display: flex;
  }
}
.personal-info {
  .card-body {
    align-items: center;
    justify-content: space-between;
    display: flex;
  }
}

.profile-header .profile-img-container {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
}

.card-img-top {
  min-height: 30vh;
}

.phone-numbers-container {
  .form-check-label {
    width: 100%;
    padding-left: 10px;
  }
}
</style>
