import multer from "multer"
import aws from "aws-sdk"
import multerS3 from "multer-s3"
const s3 = new aws.S3({
    accessKeyId: "AKIA2WSTBE5N4U3HMCG6",
    secretAccessKey: "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",
})
const Storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "public/images/")
    },
    filename(req, file, callback) {
        callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
    },
})
export const upload = multer({storage: Storage})
export const uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: "mtd-images",
        acl: "public-read",
        metadata: function(req, file, cb) {
            //console.log("Image File: S3 - ", req)
            cb(null, {fieldName: file.fieldname})
        },
        key: function(req, file, cb) {
            cb(null, Date.now().toString() + "." + file.mimetype.split("/")[1])
        },
    }),
})
