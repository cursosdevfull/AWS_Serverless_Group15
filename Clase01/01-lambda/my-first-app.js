exports.greet = (event, context, callback) => {
    console.log("Hola a todos")
    console.log("Event", event)

    callback(null, { message: "Function executed successfully" })
}