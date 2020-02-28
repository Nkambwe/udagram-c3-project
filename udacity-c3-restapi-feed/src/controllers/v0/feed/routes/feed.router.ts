import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import * as AWS from '../../../../aws';

const router: Router = Router();

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map((item) => {
            if(item.url) {
                item.url = AWS.getGetSignedUrl(item.url);
            }
    });
    res.send(items);
});

//Get a specific resource by Primary Key
//Requires resource id
router.get("/:id", async (req:Request, res:Response)=>{
    let {id} = req.params;

    //handle missing ids
    if(!id){
        return res.status(400).send("Feed id is required");
    }

    const item = await FeedItem.findByPk(id);

    //handle none existing ids
    if(item === null){
      res.status(404).send("Feed not found");
    }

    res.status(200).send(item);
});

//Get a specific resource by caption
//Requires resource id
router.get("/:caption", async (req:Request, res:Response)=>{
    let {caption} = req.params;

    //handle missing caption
    if(!caption){
        return res.status(400).send("Feed caption is required");
    }

    const item = await FeedItem.findOne({where:{caption:caption}});

    //handle none existing ids
    if(item === null){
      res.status(404).send("Feed not found");
    }

    res.status(200).send(item);
});

// update a specific resource
//router.patch('/:id', requireAuth, async (req: Request, res: Response) => {
//    let {id} = req.params;

    //handle missing ids
//    if(!id){
//        return res.status(400).send("Feed id is required");
//   }

//    const item = FeedItem.findById(id);

    //handle none existing ids
//    if(item === null){
//        return res.status(404).send("Feed not found");
//    }

//    const caption = req.body.caption;
//    const fileName = req.body.url;
//    const createdAt = req.body.createdAt;
//    const updatedAt = req.body.updatedAt;

//    var result = (await item).update({
//        caption:caption,
//        fileName:fileName,
//        createdAt:createdAt,
//        updatedAt:updatedAt
//    }, {returning: true, where:{id:id}
//    }).then((count) => {
//        res.status(201).send(result)
//    }); 
//});

// Get a signed url to put a new item in the bucket
//router.get('/signed-url/:fileName', 
//    requireAuth, 
//    async (req: Request, res: Response) => {
//    let { fileName } = req.params;
//    const url = AWS.getPutSignedUrl(fileName);
 //   res.status(201).send({url: url});
//});

// Post meta data and the filename after a file is uploaded 
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
//router.post('/', 
    //requireAuth, 
//    async (req: Request, res: Response) => {
//    const caption = req.body.caption;
 //   const fileName = req.body.url;

    // check Caption is valid
//    if (!caption) {
//        return res.status(400).send({ message: 'Caption is required or malformed' });
//    }

    // check Filename is valid
//    if (!fileName) {
//        return res.status(400).send({ message: 'File url is required' });
//    }

//    const item = await new FeedItem({
 //           caption: caption,
//            url: fileName
//    });

//   const saved_item = await item.save();

//    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
//    res.status(201).send(saved_item);
//});

export const FeedRouter: Router = router;