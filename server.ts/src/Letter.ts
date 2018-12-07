import {post} from './client' 

class Letter {

    async sendLetters(from:Object, letters:Array<Object>, stripeToken:string) {
        const uri = '/letters'
        const letterData = JSON.stringify({from: from, letters: letters, stripeToken: stripeToken})
        const [statusCode, data] = await post(uri, {'Content-Type': 'application/json'}, letterData)
        // TODO check error code
        return JSON.parse(data)
    }

    async getTrackingInfo(letterId:string) {
        // Array, because multiple events per letter
        const dummy = [{
            id: "evnt_9e84094c9368cfb",
            name: "In Local Area",
            location: "72231",
            time: "2016-06-30T15:51:41.000Z",
            date_created: "2016-06-30T17:41:59.771Z",
            date_modified: "2016-06-30T17:41:59.771Z",
            object: "tracking_event"
        }]
        return dummy
    }
}
export default new Letter();
