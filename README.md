# sikju-backend

SIkju with NodeJS + Prisma + GraphQL

## User Stories

- [x] create account
- [ ] create account from OAUTH
- [x] log in
- [x] create auction
- [ ] list created Auction
- [ ] view Auction Info
- [x] add Review
- [x] allUsers
- [ ] Like a Rest
- [x] select winning Bid
- [ ] print Coupon
- [ ] list Coupon

## RestUser Stories

- [x] auction subscribe nearby location
- [x] Bid
- [ ] subscribe winning Bid
- [ ] register lost things
- [ ] check Coupon

## Rest Stories

- [x] create New Rest
- [x] edit Rest
- [x] list nearby location
- [x] view Rest
- [ ] view User that Like this Rest

## setting

### migrate to Prisma v2
+ Schema
    - DataSource
        * provider = "postgresql"
        * url = "postgresql://{USER}:{PASSWORD}@{HOST}:{POST}/{DB}?schema={schema || public}&host={host}" # postgresql url
    - Generator
        * provider = "prisma-client-js"
        * binaryTargets = ["native"] # Mac OS only
    - Model
### AWS setting
+ Link : <https://docs.aws.amazon.com/ko_kr/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html>
+ Linux, Unix, macOS :
```~/.aws/credentials``` 에 공유자격 증명파일(.csv) 저장
+ S3 - fullmoon-sikju 버킷 설정이 퍼블릭 액세스에 대해 모든 권한을 줌<br>
<span style="color:rgb(256,80,120)">(수정 필요) Link :  <https://s3.console.aws.amazon.com/s3/home?region=ap-northeast-2></span>