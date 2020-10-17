# friendly2
Google Chrome extension which automates sending requests to friends/subscribers.

## Usage
1. Download the latest [release](https://github.com/my-repositories/friendly2/releases)
2. Unzip the downloaded file
3. Navigate to Browser Settings -> More Tools -> Extensions
4. Click Load unpacked and pick the directory with the extension


### How It Works
1. When you open any site, a check is performed to see if the current address matches the address from the list of available for automation
2. If the check is executed, the script checks the authorization on the current web resource
3. Next, looks for all available links to profiles and save them
4. Subscribes to the current profile, if possible
5. Subscribes to all profiles that are available on this page
6. Goes to the next page, which will be the last element of the list of available links (from p. 3)



#### How to Build

```
yarn test
yarn run build:prod

# for development build
yarn run build:dev
```
