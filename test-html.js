var str = '{}';
try{
    JSON.parse(str);
}catch(e){
    console.log(e.message);
} 
