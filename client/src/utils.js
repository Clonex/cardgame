
export function getImage(color, type)
{
    let ret = "/images/cards/large/card_back_alt_large.png";
    if(color)
    {
        ret = "/images/cards/large/";
        if(type !== "PLUS4" && type !== "wild")
        {
            ret += `${color}_`;
        }
        ret += `${types[type]}_large.png`;
    }
    return ret;
}