module.exports = {
    newPlayer : ( id ,  userId , userName ,email ,index)=>{
        return {
            id: id,
            userId : userId,
            index:index,
            email: email,
            name : userName,
            cards:[],
            score : 0,
            active : false,
            purchase : null
        }
    }






}