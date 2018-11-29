import {post} from './client' 

class Letter {

    async sendLetters(from:Object, letters:Array<Object>, stripeToken:string) {
        const uri = '/letters'
        const letterData = JSON.stringify({from: from, letters: letters, stripeToken: stripeToken})
        const [statusCode, data] = await post(uri, {'Content-Type': 'application/json'}, letterData)
        // TODO check error code
        return JSON.parse(data)
    }
}
export default new Letter();
