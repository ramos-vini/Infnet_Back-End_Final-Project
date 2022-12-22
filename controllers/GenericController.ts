class GenericController{
    generatePagination(limit: any, page: any){
        const _limit = limit ? parseInt(limit) : 8,
              _page = page ? parseInt(page) - 1: 0;
              
        return [_limit, _page]
    }
}

export default GenericController;