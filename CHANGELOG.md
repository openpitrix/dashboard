#### 0.4.2 (2019-05-08)

##### Chores

*  standard-version cant generate changelog from commit range ([a3e65fbc](https://github.com/openpitrix/dashboard/commit/a3e65fbc1d60af21ad84a485207e28bb15a80116))
*  Speed up webpack build ([#1114](https://github.com/openpitrix/dashboard/pull/1114)) ([ac935e38](https://github.com/openpitrix/dashboard/commit/ac935e380ffbb6bf0c7f6bf09f1f5a58190b61c9))
*  Add English i18n ([#1105](https://github.com/openpitrix/dashboard/pull/1105)) ([cf9ecb5c](https://github.com/openpitrix/dashboard/commit/cf9ecb5c9c4ee9f743221ab175fc1bd50326e900))
*  Remove repo related files ([#1103](https://github.com/openpitrix/dashboard/pull/1103)) ([aeee8eb9](https://github.com/openpitrix/dashboard/commit/aeee8eb9f11f4c4b4b855fcbbb2d0562ca3ad068))
*  Click switch button trigger select all actions in ISV role page ([#1100](https://github.com/openpitrix/dashboard/pull/1100)) ([fa48b5cf](https://github.com/openpitrix/dashboard/commit/fa48b5cfba0942e91f4115bf1a22322096e6bf8b))
*  Set navigation menu according to permissions ([#1094](https://github.com/openpitrix/dashboard/pull/1094)) ([cd635608](https://github.com/openpitrix/dashboard/commit/cd63560861350214eb25aee37019f2964c83b315))
* **release:**  0.4.1 ([5cde15cd](https://github.com/openpitrix/dashboard/commit/5cde15cd68bc39f3e994dfbfa6b18d747055bc1c))

##### Bug Fixes

*  Form input width ([#1113](https://github.com/openpitrix/dashboard/pull/1113)) ([f0230f39](https://github.com/openpitrix/dashboard/commit/f0230f3943be8cd0fb8f119964c84b63ba71bf2d))
*  Cyclic dependency in routes module ([#1112](https://github.com/openpitrix/dashboard/pull/1112)) ([d7550e5f](https://github.com/openpitrix/dashboard/commit/d7550e5fd8530cdf70a2ed5333d25f4d3e8028b0))
*  Deploy helm app, changed values.yaml not updated ([#1109](https://github.com/openpitrix/dashboard/pull/1109)) ([67e4beef](https://github.com/openpitrix/dashboard/commit/67e4beefdb0b4ce699bfa2c374a78a4f92433ed1))
*  Home page infinite scroll ([#1104](https://github.com/openpitrix/dashboard/pull/1104)) ([bd70a2fd](https://github.com/openpitrix/dashboard/commit/bd70a2fdfb2d7b1d61ab82a9765ab3ff0e35e19a))
*  Developer navigation app icon style ([#1099](https://github.com/openpitrix/dashboard/pull/1099)) ([619644e5](https://github.com/openpitrix/dashboard/commit/619644e51313768a6cf80f9fd18b0f6e4f3cd867))
*  Create app when add delivery type ([#1096](https://github.com/openpitrix/dashboard/pull/1096)) ([a183d5fd](https://github.com/openpitrix/dashboard/commit/a183d5fd7c75e54f8aa0da79898f0cdb175a1e9a))
*  Query deploy statistics add deleted status ([#1097](https://github.com/openpitrix/dashboard/pull/1097)) ([7d9e5d89](https://github.com/openpitrix/dashboard/commit/7d9e5d892960fcb1326c70e5d92180568cc7724b))
*  My apps query status param ([#1095](https://github.com/openpitrix/dashboard/pull/1095)) ([5a859d2b](https://github.com/openpitrix/dashboard/commit/5a859d2b4e34bc3368801a639d63741a90644cb3))

##### Refactors

*  Unified management for form sub-components ([#1110](https://github.com/openpitrix/dashboard/pull/1110)) ([07218c75](https://github.com/openpitrix/dashboard/commit/07218c75cd156e0c562e30fd9433b6373f80aaf1))
*  Category mgmt icon list ([#1102](https://github.com/openpitrix/dashboard/pull/1102)) ([af267aa4](https://github.com/openpitrix/dashboard/commit/af267aa49cd4e65018b4f6185453fa8df720359a))
*  Jest config not show coverage files ([#1101](https://github.com/openpitrix/dashboard/pull/1101)) ([4d9e96fd](https://github.com/openpitrix/dashboard/commit/4d9e96fda1562d3297397b6c4cbe6f8f531e0387))
*  Detail pages loading style ([#1098](https://github.com/openpitrix/dashboard/pull/1098)) ([0f9a0bb5](https://github.com/openpitrix/dashboard/commit/0f9a0bb5f94ce8da80f2a1fea53516d848e73b21))

##### Tests

*  Add unit test for components ([#1107](https://github.com/openpitrix/dashboard/pull/1107)) ([280cb6a3](https://github.com/openpitrix/dashboard/commit/280cb6a3556600db4b6a2a8cb28895677afb4749))


<a name="0.4.1"></a>
## [0.4.1](https://github.com/openpitrix/dashboard/compare/v0.4.0...v0.4.1) (2019-03-29)


### Bug Fixes

* fix: Deploy app for vm ([#1090](https://github.com/openpitrix/dashboard/issues/1090)) ([2c4dd4d](https://github.com/openpitrix/dashboard/commit/2c4dd4d))
* refactor: Admin provider page add loading status (#1091)
* refactor: Runtime page form placeholder (#1092)
* fix: Cluster update env with invalid config.json (#1093)


<a name="0.4.0"></a>
# [0.4.0](https://github.com/openpitrix/dashboard/compare/v0.3.6...v0.4.0) (2019-03-29)


### Bug Fixes

* Account and provider detail page style ([#965](https://github.com/openpitrix/dashboard/issues/965)) ([d461a15](https://github.com/openpitrix/dashboard/commit/d461a15))
* Account page handle save ([#1045](https://github.com/openpitrix/dashboard/issues/1045)) ([07e863d](https://github.com/openpitrix/dashboard/commit/07e863d))
* Add ISV query in app detail ([#932](https://github.com/openpitrix/dashboard/issues/932)) ([1a0b7bb](https://github.com/openpitrix/dashboard/commit/1a0b7bb))
* Add namespace tip ([#914](https://github.com/openpitrix/dashboard/issues/914)) ([8700067](https://github.com/openpitrix/dashboard/commit/8700067))
* Add regex for helm appName ([#1077](https://github.com/openpitrix/dashboard/issues/1077)) ([f241ea6](https://github.com/openpitrix/dashboard/commit/f241ea6))
* Admin delete role tips ([#799](https://github.com/openpitrix/dashboard/issues/799)) ([208d208](https://github.com/openpitrix/dashboard/commit/208d208))
* Admin user page of groupName ([#1007](https://github.com/openpitrix/dashboard/issues/1007)) ([be16472](https://github.com/openpitrix/dashboard/commit/be16472))
* Api role:module no checked_action_id ([#801](https://github.com/openpitrix/dashboard/issues/801)) ([aefa8d7](https://github.com/openpitrix/dashboard/commit/aefa8d7))
* App version and review related issues ([#1066](https://github.com/openpitrix/dashboard/issues/1066)) ([9fbc8b2](https://github.com/openpitrix/dashboard/commit/9fbc8b2))
* Can delete suspended app version ([#988](https://github.com/openpitrix/dashboard/issues/988)) ([001b6be](https://github.com/openpitrix/dashboard/commit/001b6be))
* Category page add app, can not choose app ([#1074](https://github.com/openpitrix/dashboard/issues/1074)) ([aa7fded](https://github.com/openpitrix/dashboard/commit/aa7fded))
* Create runtime credential throw missing name ([#1026](https://github.com/openpitrix/dashboard/issues/1026)) ([80b7c29](https://github.com/openpitrix/dashboard/commit/80b7c29))
* Deploy app no valid version ([#996](https://github.com/openpitrix/dashboard/issues/996)) ([7804871](https://github.com/openpitrix/dashboard/commit/7804871))
* Deployed app detail page reference clusters ([ef68a37](https://github.com/openpitrix/dashboard/commit/ef68a37))
* Email config display_sender ([#867](https://github.com/openpitrix/dashboard/issues/867)) ([7a4d16d](https://github.com/openpitrix/dashboard/commit/7a4d16d))
* Hide pagination for helm's cluster ([#1010](https://github.com/openpitrix/dashboard/issues/1010)) ([6c91379](https://github.com/openpitrix/dashboard/commit/6c91379))
* Hide terms of service about app info ([7c8652a](https://github.com/openpitrix/dashboard/commit/7c8652a))
* I18n key and ns separator ([#962](https://github.com/openpitrix/dashboard/issues/962)) ([a9d35d4](https://github.com/openpitrix/dashboard/commit/a9d35d4))
* Isv apply auth error ([#1011](https://github.com/openpitrix/dashboard/issues/1011)) ([6c45c46](https://github.com/openpitrix/dashboard/commit/6c45c46))
* ISV creat role param is_check_all ([#1009](https://github.com/openpitrix/dashboard/issues/1009)) ([e1dab0a](https://github.com/openpitrix/dashboard/commit/e1dab0a))
* ISV create user ([#898](https://github.com/openpitrix/dashboard/issues/898)) ([d12ad09](https://github.com/openpitrix/dashboard/commit/d12ad09))
* isv role page ([#803](https://github.com/openpitrix/dashboard/issues/803)) ([c042569](https://github.com/openpitrix/dashboard/commit/c042569))
* Loading icon not work on firefox ([#953](https://github.com/openpitrix/dashboard/issues/953)) ([648569b](https://github.com/openpitrix/dashboard/commit/648569b))
* Notification server page display_sender ([#1030](https://github.com/openpitrix/dashboard/issues/1030)) ([6d88316](https://github.com/openpitrix/dashboard/commit/6d88316))
* Npm script add cross-env prefix ([#879](https://github.com/openpitrix/dashboard/issues/879)) ([d496c00](https://github.com/openpitrix/dashboard/commit/d496c00))
* Production build ([#881](https://github.com/openpitrix/dashboard/issues/881)) ([8aaf7f3](https://github.com/openpitrix/dashboard/commit/8aaf7f3))
* Proxy server read from process.env ([#938](https://github.com/openpitrix/dashboard/issues/938)) ([9952a63](https://github.com/openpitrix/dashboard/commit/9952a63))
* Review detail page add download package ([#1028](https://github.com/openpitrix/dashboard/issues/1028)) ([ec9f7cf](https://github.com/openpitrix/dashboard/commit/ec9f7cf))
* Runtime detail reference clusters page ([#1079](https://github.com/openpitrix/dashboard/issues/1079)) ([fc53b0a](https://github.com/openpitrix/dashboard/commit/fc53b0a))
* Runtime set initial credential name ([#911](https://github.com/openpitrix/dashboard/issues/911)) ([0456f9f](https://github.com/openpitrix/dashboard/commit/0456f9f))
* Runtime tab of k8s ([#1006](https://github.com/openpitrix/dashboard/issues/1006)) ([05fa89a](https://github.com/openpitrix/dashboard/commit/05fa89a))
* Scss color define error ([#826](https://github.com/openpitrix/dashboard/issues/826)) ([a65313f](https://github.com/openpitrix/dashboard/commit/a65313f))
* Security problems in packages ([#825](https://github.com/openpitrix/dashboard/issues/825)) ([ceb5609](https://github.com/openpitrix/dashboard/commit/ceb5609))
* Side nav styles for dev role ([#847](https://github.com/openpitrix/dashboard/issues/847)) ([0e5b07d](https://github.com/openpitrix/dashboard/commit/0e5b07d))
* SSH page style by new design ([#805](https://github.com/openpitrix/dashboard/issues/805)) ([33ddae8](https://github.com/openpitrix/dashboard/commit/33ddae8))
* Table checkbox ([#1029](https://github.com/openpitrix/dashboard/issues/1029)) ([6d35016](https://github.com/openpitrix/dashboard/commit/6d35016))
* Travis build failed due to slim image ([#831](https://github.com/openpitrix/dashboard/issues/831)) ([a16e453](https://github.com/openpitrix/dashboard/commit/a16e453))
* Update localstorage apps when delete or update app ([#992](https://github.com/openpitrix/dashboard/issues/992)) ([b77c341](https://github.com/openpitrix/dashboard/commit/b77c341))
* User portal clusters query add owner param ([#994](https://github.com/openpitrix/dashboard/issues/994)) ([06a3b3d](https://github.com/openpitrix/dashboard/commit/06a3b3d))
* User set role ([#874](https://github.com/openpitrix/dashboard/issues/874)) ([e9336e2](https://github.com/openpitrix/dashboard/commit/e9336e2))
* Version suspend operate id error ([#927](https://github.com/openpitrix/dashboard/issues/927)) ([8f49993](https://github.com/openpitrix/dashboard/commit/8f49993))
* Versions and audits pages style ([#810](https://github.com/openpitrix/dashboard/issues/810)) ([41f8893](https://github.com/openpitrix/dashboard/commit/41f8893))


### Features

* Add cloud info page ([#945](https://github.com/openpitrix/dashboard/issues/945)) ([63d541e](https://github.com/openpitrix/dashboard/commit/63d541e))
* Add websocket proxy server, refine socket client  ([#794](https://github.com/openpitrix/dashboard/issues/794)) ([fca7393](https://github.com/openpitrix/dashboard/commit/fca7393))
* Change runtime page ([#808](https://github.com/openpitrix/dashboard/issues/808)) ([a506da2](https://github.com/openpitrix/dashboard/commit/a506da2))
* ISV create role ([#817](https://github.com/openpitrix/dashboard/issues/817)) ([36d3699](https://github.com/openpitrix/dashboard/commit/36d3699))



<a name="0.3.6"></a>
## [0.3.6](https://github.com/openpitrix/dashboard/compare/v0.3.4...v0.3.6) (2019-03-13)


### Bug Fixes

* Add runtime credential page bottom tips ([#737](https://github.com/openpitrix/dashboard/issues/737)) ([8c8be46](https://github.com/openpitrix/dashboard/commit/8c8be46))
* Admin nav label ([#866](https://github.com/openpitrix/dashboard/issues/866)) ([ed05584](https://github.com/openpitrix/dashboard/commit/ed05584))
* Am api url ([#772](https://github.com/openpitrix/dashboard/issues/772)) ([f42b9cc](https://github.com/openpitrix/dashboard/commit/f42b9cc))
* Api role:module no checked_action_id ([#801](https://github.com/openpitrix/dashboard/issues/801)) ([aefa8d7](https://github.com/openpitrix/dashboard/commit/aefa8d7))
* Banner and app detail type version ([#804](https://github.com/openpitrix/dashboard/issues/804)) ([e02b3c6](https://github.com/openpitrix/dashboard/commit/e02b3c6))
* Cluster page actions failed due to tableAction mixin ([#740](https://github.com/openpitrix/dashboard/issues/740)) ([6dfd12f](https://github.com/openpitrix/dashboard/commit/6dfd12f))
* Create runtime credential not reset last credential ([#763](https://github.com/openpitrix/dashboard/issues/763)) ([6e2daf4](https://github.com/openpitrix/dashboard/commit/6e2daf4))
* Deploy app show note link when no runtimes ([#784](https://github.com/openpitrix/dashboard/issues/784)) ([3dfe90e](https://github.com/openpitrix/dashboard/commit/3dfe90e))
* Fetch runtime credential ([#725](https://github.com/openpitrix/dashboard/issues/725)) ([a7b83fa](https://github.com/openpitrix/dashboard/commit/a7b83fa))
* Npm script add cross-env prefix ([#879](https://github.com/openpitrix/dashboard/issues/879)) ([d496c00](https://github.com/openpitrix/dashboard/commit/d496c00))
* Provider interface method modify by new api ([#721](https://github.com/openpitrix/dashboard/issues/721)) ([9f3d33e](https://github.com/openpitrix/dashboard/commit/9f3d33e))
* Role api ([#774](https://github.com/openpitrix/dashboard/issues/774)) ([f5c7493](https://github.com/openpitrix/dashboard/commit/f5c7493))
* Security problems in packages ([#825](https://github.com/openpitrix/dashboard/issues/825)) ([ceb5609](https://github.com/openpitrix/dashboard/commit/ceb5609))
* SideNav routes ([#699](https://github.com/openpitrix/dashboard/issues/699)) ([0cf3061](https://github.com/openpitrix/dashboard/commit/0cf3061))
* SSH page style by new design ([#805](https://github.com/openpitrix/dashboard/issues/805)) ([33ddae8](https://github.com/openpitrix/dashboard/commit/33ddae8))
* Travis build failed due to slim image ([#831](https://github.com/openpitrix/dashboard/issues/831)) ([a16e453](https://github.com/openpitrix/dashboard/commit/a16e453))
* User get role and portal by new api ([#775](https://github.com/openpitrix/dashboard/issues/775)) ([3ff2eef](https://github.com/openpitrix/dashboard/commit/3ff2eef))
* User portal issues ([#722](https://github.com/openpitrix/dashboard/issues/722)) ([f957879](https://github.com/openpitrix/dashboard/commit/f957879))
* Version review and  ISV apply review error ([#739](https://github.com/openpitrix/dashboard/issues/739)) ([1a3218f](https://github.com/openpitrix/dashboard/commit/1a3218f))
* Change runtime page ([#808](https://github.com/openpitrix/dashboard/issues/808)) ([a506da2](https://github.com/openpitrix/dashboard/commit/a506da2))


### Features

* Add admin user and role pages ([#747](https://github.com/openpitrix/dashboard/issues/747)) ([d9a8276](https://github.com/openpitrix/dashboard/commit/d9a8276))
* Add websocket proxy server, refine socket client  ([#794](https://github.com/openpitrix/dashboard/issues/794)) ([fca7393](https://github.com/openpitrix/dashboard/commit/fca7393))
* ISV create role ([#817](https://github.com/openpitrix/dashboard/issues/817)) ([36d3699](https://github.com/openpitrix/dashboard/commit/36d3699))



<a name="0.3.5"></a>
## [0.3.5](https://github.com/openpitrix/dashboard/compare/v0.3.4...v0.3.5) (2019-02-12)


### Bug Fixes

* Admin user filterList ([1ce8426](https://github.com/openpitrix/dashboard/commit/1ce8426))
* App info screenshots error ([#741](https://github.com/openpitrix/dashboard/issues/741)) ([75b85e9](https://github.com/openpitrix/dashboard/commit/75b85e9))
* Cluster page actions failed due to tableAction mixin ([#740](https://github.com/openpitrix/dashboard/issues/740)) ([6dfd12f](https://github.com/openpitrix/dashboard/commit/6dfd12f))
* Create runtime credential not reset last credential ([#763](https://github.com/openpitrix/dashboard/issues/763)) ([6e2daf4](https://github.com/openpitrix/dashboard/commit/6e2daf4))
* Deploy and runtime page api query ([#710](https://github.com/openpitrix/dashboard/issues/710)) ([9691a21](https://github.com/openpitrix/dashboard/commit/9691a21))
* Deploy app show note link when no runtimes ([#784](https://github.com/openpitrix/dashboard/issues/784)) ([3dfe90e](https://github.com/openpitrix/dashboard/commit/3dfe90e))
* Fetch runtime credential ([#725](https://github.com/openpitrix/dashboard/issues/725)) ([a7b83fa](https://github.com/openpitrix/dashboard/commit/a7b83fa))
* Pages dashboard link change to  toRoute ([#711](https://github.com/openpitrix/dashboard/issues/711)) ([c2d6824](https://github.com/openpitrix/dashboard/commit/c2d6824))
* Portal review issues ([#709](https://github.com/openpitrix/dashboard/issues/709)) ([ffc9ea5](https://github.com/openpitrix/dashboard/commit/ffc9ea5))
* Provider interface method modify by new api ([#721](https://github.com/openpitrix/dashboard/issues/721)) ([9f3d33e](https://github.com/openpitrix/dashboard/commit/9f3d33e))
* Role api ([#774](https://github.com/openpitrix/dashboard/issues/774)) ([f5c7493](https://github.com/openpitrix/dashboard/commit/f5c7493))
* Sandbox and user instances query for dev ([#771](https://github.com/openpitrix/dashboard/issues/771)) ([4fd7363](https://github.com/openpitrix/dashboard/commit/4fd7363))
* SideNav routes ([#699](https://github.com/openpitrix/dashboard/issues/699)) ([0cf3061](https://github.com/openpitrix/dashboard/commit/0cf3061))
* **role mgmt:** Expand all module actions when switch role ([#791](https://github.com/openpitrix/dashboard/issues/791)) ([9c0530f](https://github.com/openpitrix/dashboard/commit/9c0530f))
* User get role and portal by new api ([#775](https://github.com/openpitrix/dashboard/issues/775)) ([3ff2eef](https://github.com/openpitrix/dashboard/commit/3ff2eef))
* User or sandbox instance detail page link ([#734](https://github.com/openpitrix/dashboard/issues/734)) ([72771a9](https://github.com/openpitrix/dashboard/commit/72771a9))
* User portal issues ([#722](https://github.com/openpitrix/dashboard/issues/722)) ([f957879](https://github.com/openpitrix/dashboard/commit/f957879))
* User portal top nav runtime label ([#764](https://github.com/openpitrix/dashboard/issues/764)) ([09b4de1](https://github.com/openpitrix/dashboard/commit/09b4de1))
* Version review and  ISV apply review error ([#739](https://github.com/openpitrix/dashboard/issues/739)) ([1a3218f](https://github.com/openpitrix/dashboard/commit/1a3218f))


### Features

* Add admin user and role mgmt pages ([#747](https://github.com/openpitrix/dashboard/issues/747)) ([d9a8276](https://github.com/openpitrix/dashboard/commit/d9a8276))



<a name="0.3.4"></a>
## [0.3.4](https://github.com/openpitrix/dashboard/compare/v0.3.3...v0.3.4) (2019-01-22)


### Bug Fixes

* App link in provider detail page ([#697](https://github.com/openpitrix/dashboard/issues/697)) ([e7c3524](https://github.com/openpitrix/dashboard/commit/e7c3524))
* App version not update when changed url ([#669](https://github.com/openpitrix/dashboard/issues/669)) ([cb3942c](https://github.com/openpitrix/dashboard/commit/cb3942c))
* Category app count ([#681](https://github.com/openpitrix/dashboard/issues/681)) ([171cdbf](https://github.com/openpitrix/dashboard/commit/171cdbf))
* Overview page routes ([#694](https://github.com/openpitrix/dashboard/issues/694)) ([b8893ff](https://github.com/openpitrix/dashboard/commit/b8893ff))
* Page access role check, app card version type label ([#677](https://github.com/openpitrix/dashboard/issues/677)) ([8aacb5d](https://github.com/openpitrix/dashboard/commit/8aacb5d))
* Portal issues ([#696](https://github.com/openpitrix/dashboard/issues/696)) ([16fd95f](https://github.com/openpitrix/dashboard/commit/16fd95f))
* SideNav active style check ([#693](https://github.com/openpitrix/dashboard/issues/693)) ([762124c](https://github.com/openpitrix/dashboard/commit/762124c))
* SideNav routes, dev links in isv portal redirect wrong place ([#695](https://github.com/openpitrix/dashboard/issues/695)) ([9323674](https://github.com/openpitrix/dashboard/commit/9323674))
* WrapRoute path default val ([#698](https://github.com/openpitrix/dashboard/issues/698)) ([05fcf3a](https://github.com/openpitrix/dashboard/commit/05fcf3a))


### Features

* Add cloud env setting page and notification server page ([#682](https://github.com/openpitrix/dashboard/issues/682)) ([2f824a9](https://github.com/openpitrix/dashboard/commit/2f824a9))
* Portal design ([#688](https://github.com/openpitrix/dashboard/issues/688)) ([cb05f32](https://github.com/openpitrix/dashboard/commit/cb05f32)), closes [#690](https://github.com/openpitrix/dashboard/issues/690) [#691](https://github.com/openpitrix/dashboard/issues/691) [#692](https://github.com/openpitrix/dashboard/issues/692)



<a name="0.3.3"></a>
## [0.3.3](https://github.com/openpitrix/dashboard/compare/v0.3.2...v0.3.3) (2019-01-14)


### Bug Fixes

* App detail page userId transfer name ([#626](https://github.com/openpitrix/dashboard/issues/626)) ([de8b597](https://github.com/openpitrix/dashboard/commit/de8b597))
* Auth token not updated cause page redirect to login ([#609](https://github.com/openpitrix/dashboard/issues/609)) ([90bf637](https://github.com/openpitrix/dashboard/commit/90bf637))
* Cluster detail yaml string transform ([#604](https://github.com/openpitrix/dashboard/issues/604)) ([dd26562](https://github.com/openpitrix/dashboard/commit/dd26562))
* Config parser factory.js getRenderType ([#607](https://github.com/openpitrix/dashboard/issues/607)) ([3bbd2b2](https://github.com/openpitrix/dashboard/commit/3bbd2b2))
* Create user modal style ([#639](https://github.com/openpitrix/dashboard/issues/639)) ([76d4d57](https://github.com/openpitrix/dashboard/commit/76d4d57))
* Deploy app, parse config with env params ([#608](https://github.com/openpitrix/dashboard/issues/608)) ([f747256](https://github.com/openpitrix/dashboard/commit/f747256))
* Dockerfile port ([#630](https://github.com/openpitrix/dashboard/issues/630)) ([01dff67](https://github.com/openpitrix/dashboard/commit/01dff67))
* Home page fetch active apps ([#666](https://github.com/openpitrix/dashboard/issues/666)) ([a6a4bb2](https://github.com/openpitrix/dashboard/commit/a6a4bb2))
* Home page loading data and card animation ([#664](https://github.com/openpitrix/dashboard/issues/664)) ([16fa672](https://github.com/openpitrix/dashboard/commit/16fa672))
* Modify code format by IDE ([c705455](https://github.com/openpitrix/dashboard/commit/c705455))
* Npm run locale ([#642](https://github.com/openpitrix/dashboard/issues/642)) ([f23c3dd](https://github.com/openpitrix/dashboard/commit/f23c3dd))
* Reviews and audits page fetch data by new api ([#645](https://github.com/openpitrix/dashboard/issues/645)) ([6c61cf0](https://github.com/openpitrix/dashboard/commit/6c61cf0))
* Router info different navigation info ([#612](https://github.com/openpitrix/dashboard/issues/612)) ([c483986](https://github.com/openpitrix/dashboard/commit/c483986))
* Table render column filter sprea args ([#634](https://github.com/openpitrix/dashboard/issues/634)) ([a79e3cb](https://github.com/openpitrix/dashboard/commit/a79e3cb))
* Travis build error ([#624](https://github.com/openpitrix/dashboard/issues/624)) ([cf0bfa8](https://github.com/openpitrix/dashboard/commit/cf0bfa8))
* Validate runtime credential and create helm type runtime ([#601](https://github.com/openpitrix/dashboard/issues/601)) ([eeb80e2](https://github.com/openpitrix/dashboard/commit/eeb80e2))


### Features

* Add new app detail page ([#655](https://github.com/openpitrix/dashboard/issues/655)) ([762fdf4](https://github.com/openpitrix/dashboard/commit/762fdf4))
* Add new deploy page ([#665](https://github.com/openpitrix/dashboard/issues/665)) ([0ce38d6](https://github.com/openpitrix/dashboard/commit/0ce38d6))
* Add new ISV navigation ([#611](https://github.com/openpitrix/dashboard/issues/611)) ([9700678](https://github.com/openpitrix/dashboard/commit/9700678))
* Add new review pages for admin and ISV ([#591](https://github.com/openpitrix/dashboard/issues/591)) ([aa5f664](https://github.com/openpitrix/dashboard/commit/aa5f664))
* Add providers and apply static pages ([#602](https://github.com/openpitrix/dashboard/issues/602)) ([787d880](https://github.com/openpitrix/dashboard/commit/787d880))
* Admin category mgmt ([#616](https://github.com/openpitrix/dashboard/issues/616)) ([7b752b9](https://github.com/openpitrix/dashboard/commit/7b752b9))
* App information mgmt and service contract ([#594](https://github.com/openpitrix/dashboard/issues/594)) ([879a69e](https://github.com/openpitrix/dashboard/commit/879a69e))
* App mgmt for isv and admin ([#617](https://github.com/openpitrix/dashboard/issues/617)) ([f6c876a](https://github.com/openpitrix/dashboard/commit/f6c876a))
* Create testing runtime and runtime credential ([#579](https://github.com/openpitrix/dashboard/issues/579)) ([00e1fa1](https://github.com/openpitrix/dashboard/commit/00e1fa1)), closes [#571](https://github.com/openpitrix/dashboard/issues/571)
* Developer test and user instance pages ([#584](https://github.com/openpitrix/dashboard/issues/584)) ([c2cd6c3](https://github.com/openpitrix/dashboard/commit/c2cd6c3))
* Download app version package file from browser ([#652](https://github.com/openpitrix/dashboard/issues/652)) ([6621cb3](https://github.com/openpitrix/dashboard/commit/6621cb3))
* Instances and purchased pages for user ([#649](https://github.com/openpitrix/dashboard/issues/649)) ([cf85fa5](https://github.com/openpitrix/dashboard/commit/cf85fa5))
* Integrate app version review api for all roles ([#621](https://github.com/openpitrix/dashboard/issues/621)) ([35e7237](https://github.com/openpitrix/dashboard/commit/35e7237))
* ISV pages integrate API ([#619](https://github.com/openpitrix/dashboard/issues/619)) ([c0eaef6](https://github.com/openpitrix/dashboard/commit/c0eaef6))
* New app version mgmt pages ([#578](https://github.com/openpitrix/dashboard/issues/578)) ([bf83cb1](https://github.com/openpitrix/dashboard/commit/bf83cb1))
* New style home page ([#654](https://github.com/openpitrix/dashboard/issues/654)) ([06107a5](https://github.com/openpitrix/dashboard/commit/06107a5))
* Review submitted app version and validate info ([#620](https://github.com/openpitrix/dashboard/issues/620)) ([5a9624c](https://github.com/openpitrix/dashboard/commit/5a9624c))
* Service provider detail and create static pages ([#615](https://github.com/openpitrix/dashboard/issues/615)) ([c6b9fa1](https://github.com/openpitrix/dashboard/commit/c6b9fa1))
* User runtime and instance list ([#614](https://github.com/openpitrix/dashboard/issues/614)) ([0de33cc](https://github.com/openpitrix/dashboard/commit/0de33cc))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/openpitrix/dashboard/compare/v0.3.0...v0.3.2) (2018-12-13)


### Bug Fixes

*  Add repo secret key validate ([#514](https://github.com/openpitrix/dashboard/issues/514)) ([cd18ff9](https://github.com/openpitrix/dashboard/commit/cd18ff9))
* App detail broken doc link ([#573](https://github.com/openpitrix/dashboard/issues/573)) ([da9ffb0](https://github.com/openpitrix/dashboard/commit/da9ffb0))
* Attachment image not display when forward request ([#568](https://github.com/openpitrix/dashboard/issues/568)) ([7756e55](https://github.com/openpitrix/dashboard/commit/7756e55))
* Cluster detail loading when runtime type not resolved ([#546](https://github.com/openpitrix/dashboard/issues/546)) ([8e535e7](https://github.com/openpitrix/dashboard/commit/8e535e7))
* Create repo add aliyun provider ([#574](https://github.com/openpitrix/dashboard/issues/574)) ([fa22f2b](https://github.com/openpitrix/dashboard/commit/fa22f2b))
* Deploy app query no runtimes add note ([#497](https://github.com/openpitrix/dashboard/issues/497)) ([caa77c1](https://github.com/openpitrix/dashboard/commit/caa77c1))
* Detail page init loading value ([#522](https://github.com/openpitrix/dashboard/issues/522)) ([fa8adbe](https://github.com/openpitrix/dashboard/commit/fa8adbe))
* Downgrade webpack to compat with extract-css-webpack-plugin ([#533](https://github.com/openpitrix/dashboard/issues/533)) ([21e7155](https://github.com/openpitrix/dashboard/commit/21e7155)), closes [#532](https://github.com/openpitrix/dashboard/issues/532)
* Eslint warnings ([#550](https://github.com/openpitrix/dashboard/issues/550)) ([0d8f4f0](https://github.com/openpitrix/dashboard/commit/0d8f4f0))
* Eslint warnings ([#566](https://github.com/openpitrix/dashboard/issues/566)) ([1e68693](https://github.com/openpitrix/dashboard/commit/1e68693))
* Helm page refresh button ([#519](https://github.com/openpitrix/dashboard/issues/519)) ([fed682d](https://github.com/openpitrix/dashboard/commit/fed682d))
* Home app list card style ([#504](https://github.com/openpitrix/dashboard/issues/504)) ([b586abf](https://github.com/openpitrix/dashboard/commit/b586abf))
* Image letter change error ([#539](https://github.com/openpitrix/dashboard/issues/539)) ([e6930a6](https://github.com/openpitrix/dashboard/commit/e6930a6))
* Mobx array out of range ([#559](https://github.com/openpitrix/dashboard/issues/559)) ([10c9ef3](https://github.com/openpitrix/dashboard/commit/10c9ef3))
* NoData filename case error ([#545](https://github.com/openpitrix/dashboard/issues/545)) ([5bceb49](https://github.com/openpitrix/dashboard/commit/5bceb49))
* Package.json script compat with npm, remove yarn cmd ([#537](https://github.com/openpitrix/dashboard/issues/537)) ([744eb34](https://github.com/openpitrix/dashboard/commit/744eb34))
* Remove event-stream due to security ([#555](https://github.com/openpitrix/dashboard/issues/555)) ([ac462b9](https://github.com/openpitrix/dashboard/commit/ac462b9)), closes [#553](https://github.com/openpitrix/dashboard/issues/553)
* Remove window.onscroll in Layout component ([#549](https://github.com/openpitrix/dashboard/issues/549)) ([30ea9cd](https://github.com/openpitrix/dashboard/commit/30ea9cd))
* Repo refresh add noLimit param ([#536](https://github.com/openpitrix/dashboard/issues/536)) ([2c1d2f1](https://github.com/openpitrix/dashboard/commit/2c1d2f1))
* Socket url compose in entry file ([#565](https://github.com/openpitrix/dashboard/issues/565)) ([2356894](https://github.com/openpitrix/dashboard/commit/2356894))
* SSHKey page nodes query ([#529](https://github.com/openpitrix/dashboard/issues/529)) ([abbf27f](https://github.com/openpitrix/dashboard/commit/abbf27f))
* Watch server config files not reload ([#558](https://github.com/openpitrix/dashboard/issues/558)) ([f130ec0](https://github.com/openpitrix/dashboard/commit/f130ec0))


### Features

* Add additional_info for helm type cluster ([#544](https://github.com/openpitrix/dashboard/issues/544)) ([6da0397](https://github.com/openpitrix/dashboard/commit/6da0397)), closes [#540](https://github.com/openpitrix/dashboard/issues/540)
* Add audit record page ([#534](https://github.com/openpitrix/dashboard/issues/534)) ([ee70460](https://github.com/openpitrix/dashboard/commit/ee70460))
* Add icon letter style ([d5ef194](https://github.com/openpitrix/dashboard/commit/d5ef194))
* Add new style navigation menu ([#509](https://github.com/openpitrix/dashboard/issues/509)) ([f9fa1f8](https://github.com/openpitrix/dashboard/commit/f9fa1f8))
* Add version audit record ([#567](https://github.com/openpitrix/dashboard/issues/567)) ([95ba6dc](https://github.com/openpitrix/dashboard/commit/95ba6dc))
* Add vm config parser, unify vm and helm type app deployment ([#503](https://github.com/openpitrix/dashboard/issues/503)) ([aa84b64](https://github.com/openpitrix/dashboard/commit/aa84b64))
* App mgmt pages ([#552](https://github.com/openpitrix/dashboard/issues/552)) ([3c14060](https://github.com/openpitrix/dashboard/commit/3c14060))
* VM cluster support add nodes and resize ([#564](https://github.com/openpitrix/dashboard/issues/564)) ([7f7cbeb](https://github.com/openpitrix/dashboard/commit/7f7cbeb))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/openpitrix/dashboard/compare/v0.1.0...v0.3.0) (2018-10-15)


### Bug Fixes

* Add menu op logo ([#386](https://github.com/openpitrix/dashboard/issues/386)) ([#426](https://github.com/openpitrix/dashboard/issues/426)) ([9d63fb5](https://github.com/openpitrix/dashboard/commit/9d63fb5))
* Admin related styles issues ([#485](https://github.com/openpitrix/dashboard/issues/485)) ([9bf5dc3](https://github.com/openpitrix/dashboard/commit/9bf5dc3)), closes [#436](https://github.com/openpitrix/dashboard/issues/436)
* App create file check bug ([#459](https://github.com/openpitrix/dashboard/issues/459)) ([a406a44](https://github.com/openpitrix/dashboard/commit/a406a44))
* App detail create new version ([#463](https://github.com/openpitrix/dashboard/issues/463)) ([eb56624](https://github.com/openpitrix/dashboard/commit/eb56624))
* Cluster detail card hide long namespace txt ([#448](https://github.com/openpitrix/dashboard/issues/448)) ([432ab76](https://github.com/openpitrix/dashboard/commit/432ab76))
* Cluster detail card show username ([#470](https://github.com/openpitrix/dashboard/issues/470)) ([7e1ff11](https://github.com/openpitrix/dashboard/commit/7e1ff11))
* Cluster detail fetch sort_key ([#310](https://github.com/openpitrix/dashboard/issues/310)) ([63b90c1](https://github.com/openpitrix/dashboard/commit/63b90c1))
* Create app error ([#461](https://github.com/openpitrix/dashboard/issues/461)) ([45cc086](https://github.com/openpitrix/dashboard/commit/45cc086))
* Deploy app click submit button throw error when config file is empty ([#324](https://github.com/openpitrix/dashboard/issues/324)) ([55629dd](https://github.com/openpitrix/dashboard/commit/55629dd))
* Deploy app select vxnet ([#314](https://github.com/openpitrix/dashboard/issues/314)) ([b92504d](https://github.com/openpitrix/dashboard/commit/b92504d))
* Deploy app version filter bug ([#449](https://github.com/openpitrix/dashboard/issues/449)) ([d448693](https://github.com/openpitrix/dashboard/commit/d448693))
* Deploy page token auth error ([#489](https://github.com/openpitrix/dashboard/issues/489)) ([b0639af](https://github.com/openpitrix/dashboard/commit/b0639af))
* Developer menu apps refresh bug ([#488](https://github.com/openpitrix/dashboard/issues/488)) ([575891c](https://github.com/openpitrix/dashboard/commit/575891c))
* Developer related style issues ([#487](https://github.com/openpitrix/dashboard/issues/487)) ([4a6f79e](https://github.com/openpitrix/dashboard/commit/4a6f79e)), closes [#434](https://github.com/openpitrix/dashboard/issues/434)
* Fetch data entangle with cluster and runtime ([#329](https://github.com/openpitrix/dashboard/issues/329)) ([7fc8cde](https://github.com/openpitrix/dashboard/commit/7fc8cde))
* Get clientId/clientSecret from env ([#432](https://github.com/openpitrix/dashboard/issues/432)) ([01482e7](https://github.com/openpitrix/dashboard/commit/01482e7))
* Header animation more smoothly when scroll ([#332](https://github.com/openpitrix/dashboard/issues/332)) ([ffebe0c](https://github.com/openpitrix/dashboard/commit/ffebe0c))
* Home page card position bug in safari ([#492](https://github.com/openpitrix/dashboard/issues/492)) ([78c14bf](https://github.com/openpitrix/dashboard/commit/78c14bf))
* I18n default lang zh not set in safari ([#407](https://github.com/openpitrix/dashboard/issues/407)) ([7545ce3](https://github.com/openpitrix/dashboard/commit/7545ce3))
* Icon svg sprite symbols override global vars ([#392](https://github.com/openpitrix/dashboard/issues/392)) ([9e28b58](https://github.com/openpitrix/dashboard/commit/9e28b58))
* Login oAuth error handle ([#396](https://github.com/openpitrix/dashboard/issues/396)) ([d552e10](https://github.com/openpitrix/dashboard/commit/d552e10))
* Modify app reviews page data ([#431](https://github.com/openpitrix/dashboard/issues/431)) ([aaa36ff](https://github.com/openpitrix/dashboard/commit/aaa36ff))
* Modify header show condition ([#464](https://github.com/openpitrix/dashboard/issues/464)) ([53de6e8](https://github.com/openpitrix/dashboard/commit/53de6e8))
* Modify overview query for different role ([#438](https://github.com/openpitrix/dashboard/issues/438)) ([2e2f175](https://github.com/openpitrix/dashboard/commit/2e2f175))
* Modify repo query for public ([#414](https://github.com/openpitrix/dashboard/issues/414)) ([1457f90](https://github.com/openpitrix/dashboard/commit/1457f90))
* No data when change pods of helm cluster ([#472](https://github.com/openpitrix/dashboard/issues/472)) ([7e782cd](https://github.com/openpitrix/dashboard/commit/7e782cd))
* Normal user related bugs ([#493](https://github.com/openpitrix/dashboard/issues/493)) ([f2d02ab](https://github.com/openpitrix/dashboard/commit/f2d02ab))
* Overview app query remove status filter ([#462](https://github.com/openpitrix/dashboard/issues/462)) ([443ebe8](https://github.com/openpitrix/dashboard/commit/443ebe8))
* Overview normal user show runtime list ([#429](https://github.com/openpitrix/dashboard/issues/429)) ([b10cde4](https://github.com/openpitrix/dashboard/commit/b10cde4))
* Pages show  userid change username ([#447](https://github.com/openpitrix/dashboard/issues/447)) ([1b66bdf](https://github.com/openpitrix/dashboard/commit/1b66bdf))
* Password modify failed ([#450](https://github.com/openpitrix/dashboard/issues/450)) ([86eafd3](https://github.com/openpitrix/dashboard/commit/86eafd3))
* Remember me button in login ([#422](https://github.com/openpitrix/dashboard/issues/422)) ([#430](https://github.com/openpitrix/dashboard/issues/430)) ([5a7d418](https://github.com/openpitrix/dashboard/commit/5a7d418))
* Repo create provider select error ([#354](https://github.com/openpitrix/dashboard/issues/354)) ([5e6b6d1](https://github.com/openpitrix/dashboard/commit/5e6b6d1))
* Switch to App list, ui thread blocked ([#345](https://github.com/openpitrix/dashboard/issues/345)) ([c5f2e81](https://github.com/openpitrix/dashboard/commit/c5f2e81))
* Table filter condition can not be clear when data source is empty ([#366](https://github.com/openpitrix/dashboard/issues/366)) ([c06dc2e](https://github.com/openpitrix/dashboard/commit/c06dc2e)), closes [#316](https://github.com/openpitrix/dashboard/issues/316)
* Table sort by `update_time` only sort in-page data ([#312](https://github.com/openpitrix/dashboard/issues/312)) ([e1a4089](https://github.com/openpitrix/dashboard/commit/e1a4089))
* Webpack config when handle css file ([#397](https://github.com/openpitrix/dashboard/issues/397)) ([0c358e2](https://github.com/openpitrix/dashboard/commit/0c358e2))
* Websocket auth failed ([#404](https://github.com/openpitrix/dashboard/issues/404)) ([211d0ac](https://github.com/openpitrix/dashboard/commit/211d0ac))


### Features

* Add app reviews page  ([#408](https://github.com/openpitrix/dashboard/issues/408)) ([8fdf8b7](https://github.com/openpitrix/dashboard/commit/8fdf8b7))
* Add cluster attach or detach key pairs ([#474](https://github.com/openpitrix/dashboard/issues/474)) ([b5a6301](https://github.com/openpitrix/dashboard/commit/b5a6301))
* Add Cluster Details(Helm) page ([#347](https://github.com/openpitrix/dashboard/issues/347)) ([#424](https://github.com/openpitrix/dashboard/issues/424)) ([a82c2c3](https://github.com/openpitrix/dashboard/commit/a82c2c3))
* Add login auth token ([#390](https://github.com/openpitrix/dashboard/issues/390)) ([48c09a9](https://github.com/openpitrix/dashboard/commit/48c09a9))
* Add profile ssh_key pages ([#287](https://github.com/openpitrix/dashboard/issues/287)) ([bad206c](https://github.com/openpitrix/dashboard/commit/bad206c))
* Add user detail page ([#317](https://github.com/openpitrix/dashboard/issues/317)) ([5be7c33](https://github.com/openpitrix/dashboard/commit/5be7c33))
* Api request add auth token ([#378](https://github.com/openpitrix/dashboard/issues/378)) ([479dc1a](https://github.com/openpitrix/dashboard/commit/479dc1a))
* Cluster and repo pages can listen to websocket messages ([#315](https://github.com/openpitrix/dashboard/issues/315)) ([d9f3ec1](https://github.com/openpitrix/dashboard/commit/d9f3ec1))
* Profile page integrate API ([#401](https://github.com/openpitrix/dashboard/issues/401)) ([ab484c0](https://github.com/openpitrix/dashboard/commit/ab484c0))
* Remove all `onEnter` preload on server side, using client side fetch ([#473](https://github.com/openpitrix/dashboard/issues/473)) ([ebc5ac7](https://github.com/openpitrix/dashboard/commit/ebc5ac7))
* User pages integrate API ([#364](https://github.com/openpitrix/dashboard/issues/364)) ([#377](https://github.com/openpitrix/dashboard/issues/377)) ([72111b8](https://github.com/openpitrix/dashboard/commit/72111b8))
