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

export const coordsToAddress = async coords => {
    const { longitude: lng, latitude: lat } = coords;
    const appKey = 'l7xx74ee61ba597e4baa989b44ce5811f781';
    const params = `appKey=${appKey}&coordType=WGS84GEO&lon=${lng}&lat=${lat}&addressType=A10`;
    // console.log(params);
    const url = 'https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&'+params;
    const res = await fetch(url,{
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json'
        }
    });
    const data = await res.json();
    return resToAddress(data);
}

const resToAddress = data => {
    const arrResult = data.addressInfo;
    //법정동 마지막 문자
    const lastLegal = arrResult.legalDong
            .charAt(arrResult.legalDong.length - 1);

    // 새주소
    let newRoadAddr = arrResult.city_do + ' '
            + arrResult.gu_gun + ' ';

    if (arrResult.eup_myun == ''
            && (lastLegal == "읍" || lastLegal == "면")) {//읍면
        newRoadAddr += arrResult.legalDong;
    } else {
        newRoadAddr += arrResult.eup_myun;
    }
    newRoadAddr += ' ' + arrResult.roadName + ' '
            + arrResult.buildingIndex;

    let ext;
    // 새주소 법정동& 건물명 체크
    if (arrResult.legalDong != ''
            && (lastLegal != "읍" && lastLegal != "면")) {//법정동과 읍면이 같은 경우

        if (arrResult.buildingName != '') {//빌딩명 존재하는 경우
            ext = `${arrResult.legalDong, arrResult.buildingName}`
        } else {
            ext = arrResult.legalDong;
        }
    } else if (arrResult.buildingName != '') {//빌딩명만 존재하는 경우
        ext = arrResult.buildingName;
    }
    let jibunAddr = arrResult.city_do + ' '
			+ arrResult.gu_gun + ' '
			+ arrResult.legalDong + ' ' + arrResult.ri
			+ ' ' + arrResult.bunji;

    return {
        ext,
        address: jibunAddr.replace(/\s{2,}/,' ').replace('서울특별시',''),
        roadAddress: newRoadAddr.replace(/\s{2,}/,' ').replace('서울특별시','')
    }
}