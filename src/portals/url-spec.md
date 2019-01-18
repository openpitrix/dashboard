# portal & routes spec

## Common pages

* / (user portal)
* /apps/:appId (user portal)

* /login

* /profile

## User portal

* /user
  * /deployed-apps
    * /:appId
  * /clusters
    * /:clusterId
  * /runtimes
  * /provider/apply

## Dev portal

* /dev

  * /apps

    * /create

    * /:appId

      * /versions
        * /:versionId
        * /create
      * /audits

      * /instances
        * /:clusterId
      * /sandbox-instances
        * /:clusterId

## ISV portal

* /isv
  * /apps
    * /:appId
    * /review
      * /:reviewId
  * /provider
    * /apply

## Admin portal

* /admin

  * /apps
    * /:appId
    * /review
      * /:reviewId
  * /clusters
    * /:clusterId
  * /runtimes
    * /:runtimeId
  * /categories

  * /users
    * /:userId

  * /providers
    * /:providerId
    * /apply
      * /:applyId
