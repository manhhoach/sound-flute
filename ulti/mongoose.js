module.exports={
    multiMongooseToObject:function(mongooses){
        return mongooses.map(mongoose => mongoose.toObject());
    },

    mongooseToObject: function(mongoose){
        return mongoose? mongoose.toObject() : mongoose;
        //return typeof mongoose === 'object' ? mongoose : mongoose.toObject();
    }
};
// folder ulti viết những hàm xử lý cho các file khác dùng