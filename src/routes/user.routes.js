import {Router} from "express"
import { registerUser } from "../controllers/user.controllers.js"
import {upload} from "../middleware/multer.middleware.js"

const router = Router()

const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]);
router.route('/register').post(cpUpload,registerUser);


export {router}


