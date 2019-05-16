const getSeoInformation = (seoDB, id, type, url) => {
    const page = seoDB ? seoDB.find(row => row.idSeo === id && row.type === type) : {};
    return Object.assign({}, page ? page : seoDB[0], {
        url
    });
};

export default getSeoInformation;


