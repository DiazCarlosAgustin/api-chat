export default function LoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		return false;
	}
}


export default function NotLoggedIn(req, res, next) {
    if(!req.isAuthenticated()){
        return next();
    }
    return false;
}

