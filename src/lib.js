import AWS from 'aws-sdk';

AWS.config.update({region: process.env.AWS_MESSAGE_REGION});

export const sendMessage = (phone, text) => {
    const params = {
        Message: text,
        PhoneNumber: `+82${phone}`
    }
    return new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
}
/**
 *
 * @param {Provider} provider
 * @param {String} token
 *
 * KAKAO RESPONSE
 * {
 *   id,
 *   properties: {
 *     nickname, thumbnail_image,profile_image
 *   },
 *   kakao_account: {
 *     profile: { nickname?, thumbnail_image_url?, profile_image_url?}
 *     is_email_valid?, is_email_varified?, email?,
 *     age_range?: "20~29", birth_day?: "1130", gender?: "female"
 *   }
 * }
 * FACEBOOK RESPONSE(field = birthday,email,gender,name)
 * {
 *  id, birthday, email, gender, nickname
 * }
 * return type
 * {
 *   profile?, name, email?, id, gender?
 * }
 */
export const getProfile = async (provider, token) => {
    let data, res, d;
    switch(provider){
        // KAKAO response

        case 'KAKAO':
            res = await fetch('kapi.kakao.com/v2/user/me',{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            d = await res.json();
            data = {
                profile: d.properties?.profile_image,
                id: d.id,
                nickname: d.nickname,
                gender: d.kakao_account?.gender,
                email: d.kakao_account?.is_email_valid && d.kakao_account?.email
            }
            break;
        case 'FACEBOOK':
            res = await fetch(`https://graph.facebook.com/me?fields=birthday,email,gender,name&access_token=${token}`)
            d = await res.json();
            data = {
                profile: d.picture?.data?.url,
                id: d.id,
                nickname: d.name,
                gender: d.gender,
                email: d.email
            }
            break;
        default: throw Error('Wrong Request');
    }
    console.log(data);
    return data;
}