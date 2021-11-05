export const arrayToString = (arr) => {
    let str = '';

    for (const i in arr) {
    		console.log('i',i)
    		if((Array.isArray(arr[i]))){
        		str +=  `${i} ${arrayToString(arr[i])} <br/>`;
        }else{
        		str +=  `${arr[i]} `;
        }
    }

    return str;
};