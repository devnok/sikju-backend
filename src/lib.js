import AWS from 'aws-sdk';

AWS.config.update({region: process.env.AWS_MESSAGE_REGION});

export const sendMessage = (phone, text) => {
    const params = {
        Message: text,
        PhoneNumber: `+82${phone}`
    }
    return new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
}