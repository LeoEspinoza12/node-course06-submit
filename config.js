const dbName = 'manski'

module.exports = {
  'secretKey': '12345-67890-09876-54321',
  'mongoUrl': `mongodb://localhost:27017/${dbName}`,


// to use passport-facebook-token, we first have to 
// add our facebookId and facebook clientSecret
// we can find this clientId and slientSecret from the 
// developers.facebook.com
// we register as developer then we create a new app
// and then we can will get the clientId and the 
// clientSecret which is generated by the facebook
  'facebook': {
    clientId: '2250685115160935',
    clientSecret: 'd82dec2ba37227750c0c74d310177ee0'
  }



}



