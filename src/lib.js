import AWS from 'aws-sdk';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

AWS.config.update({ region: process.env.AWS_MESSAGE_REGION });

export const sendMessage = (phone, text) => {
    const params = {
        Message: text,
        PhoneNumber: `+82${phone}`
    }
    return new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
}

export const getProfile = async ({ provider, token }) => {
    if (provider === 'FACEBOOK') {
        const url = "https://graph.facebook.com/me?fields=id,name,birthday,email,gender,age_range"
            + "&access_token=" + token;
        const data = await (await fetch(url)).json();
        return data;
    } else if (provider === 'KAKAO') {
        const url = "https://kapi.kakao.com/v2/user/me"
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        const data = await res.json()
        return data;
    } else {
        throw Error("Fuck you");
    }
}