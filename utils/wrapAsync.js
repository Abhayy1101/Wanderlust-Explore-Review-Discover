

function wrapAsync(fn) {
    return function(req, res, next) {
        // Call the async function and catch errors, passing them to `next`
        fn(req, res, next).catch(next);
    };
}
module.exports=wrapAsync;

//equivalent to above

// module.exports=(fn)=>{
//     return (req,res,next) =>{
//         fn(req,res,next).catch(next);
//     };
// };