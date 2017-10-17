const redis = require("redis")
    , subscriber = redis.createClient()
    , publisher  = redis.createClient();

subscriber.on("message", function(channel, message) {
    console.log("Message '" + message + "' on channel '" + channel + "' arrived!")
});

subscriber.subscribe("test");
subscriber.subscribe("lalala");


publisher.publish("test", "haaaaai");
publisher.publish("test", "kthxbai");/**
 * Created by Ruslan on 16.10.2017.
 */
publisher.publish("lalala", "kthxbai")
console.log(subscriber.__proto__.once.toString());