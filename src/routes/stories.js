import { authenticate } from "../middlewares/authenticate.js";
import { getOwnStoriesController } from "../controllers/stories.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

storiesRouter.use(authenticate);
storiesRouter.get("/my", ctrlWrapper(getOwnStoriesController));
