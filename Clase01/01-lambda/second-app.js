exports.sum = (event, context, callback) => {
    console.log("event", event)
    const { operator1, operator2 } = event

    callback(null, { result: operator1 + operator2 })
}