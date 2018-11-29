import {get} from './client' 

class Lookup {

    async findCongressPeople(address:string, city:string, state:string, zip:string) {
        const uri = "/lookup?address=" + encodeURIComponent(address) + "&city=" + encodeURIComponent(city) + "&state=" + encodeURIComponent(state) + "&zip=" + encodeURIComponent(zip)
        console.log(uri)
        const [statusCode, data] = await get(uri, {})
        // TODO check error code
        return JSON.parse(data)
    }
}


export default new Lookup();
