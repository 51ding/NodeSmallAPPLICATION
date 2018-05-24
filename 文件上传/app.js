var express=require("express");
var multer=require("multer");
var ejs=require("ejs");
var path=require("path");


const storage=multer.diskStorage({
	destination(req,file,cb){
		cb(null,"./public/upload");
	},
	filename(req,file,cb){
		cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
	}
})

var checkFileType=(file,cb)=>{
	const allowFileType=/jpeg|jpg|png|gif/;
	const extname=allowFileType.test(path.extname(file.originalname).toLowerCase());
	const mimetype=allowFileType.test(file.mimetype);
	if(extname && mimetype){
		return cb(null,true);
	}
	else{
		cb("无效的文件类型！");
	}
}

var upload = multer({
	storage: storage,
	limits:{
		fileSize:10000000000
	},
	fileFilter(req,file,cb){
		checkFileType(file,cb);
	}
}).single("img");




var app=express();

app.set("view engine","ejs");

app.use(express.static("./public"));


app.get("/",(req,res,next)=>{res.render("index")});

app.post("/upload",(req,res) =>{
	upload(req,res,err=>{
		if(err) return res.render("index",{
			msg:err
		});
		else{
			if(req.file=='undefined'){
				return res.render("index",{
					msg:"没有选择文件"
				})
			};
			res.render("index",{
				msg:"文件上传成功",
				file:`/upload/${req.file.filename}`
			})
		}
	})
})

const port=3001;


app.listen(port,() =>{
	console.log(`server is running at ${port}`);
})
