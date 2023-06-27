import { acceptors, resolvers } from '../../../service/web.service';

acceptors.push( (args, req, res) => {
    return true;
});

resolvers.push( ( args, req, res) => {
    return false;
});
