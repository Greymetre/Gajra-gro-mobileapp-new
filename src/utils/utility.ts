
export const objectAppendIntoformData = async(formData: any, obj: any, key: any) => {
    var i, k;
    for (i in obj) {
        if(i !== '_id')
        {
            k = key ? key + '[' + i + ']' : i;
            if (typeof obj[i] == 'object')
            objectAppendIntoformData(formData, obj[i], k);
            else
                formData.append(k, obj[i]);
        }
    }
    return formData
}