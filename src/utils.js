import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET)

export const EARTH_RADIUS_KM = 6371;

const PI = 3.141592;
export const rad2Deg = rad => rad * 180 / PI
export const deg2Rad = deg => deg * PI / 180

const randInt = range => Math.floor(Math.random() * range)
export const generateSecret = n => {
    const arr = new Array(n);
    for(let i=0;i<n;i++) arr[i] = randInt(10);
    return arr.join('')
}
export const lnlrange = (location, distance) => { // x, y는 경위도로 나타내어짐.
    const maxLat = location.latitude + rad2Deg(distance / EARTH_RADIUS_KM);
    const minLat = location.latitude - rad2Deg(distance / EARTH_RADIUS_KM);
    const maxLon = location.longitude + rad2Deg(distance / EARTH_RADIUS_KM / Math.cos(deg2Rad(location.latitude)));
    const minLon = location.longitude - rad2Deg(distance / EARTH_RADIUS_KM / Math.cos(deg2Rad(location.latitude)));
    return {
        maxLat, minLat, maxLon, minLon
    };
}
export const generateHash = password => bcrypt.hash(password, Number(process.env.BCRYPT_SALT))
export const compareHash = (password, hash) => bcrypt.compare(password, hash)