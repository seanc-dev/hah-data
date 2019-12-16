module.exports = {
    
    dataObjInit: async function (instance, requestType, routeName, req, res) {
        
        try {
            let data = await instance.init(requestType);
            return res.send(data);
        } catch (err) {
            console.error("Error in " + instance.dimension + " " + routeName + " route: Failed to initiate instance");
            console.error(err);
            return res.status(500).send({error: err});
        }
        
    }

}