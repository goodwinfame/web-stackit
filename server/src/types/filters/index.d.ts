interface Defaultfilter {
    key: string;
    pagesize: number;
    sort: sortType;
    order: orderType;
    tagged?: string[];
    nottagged?: string;
    accepted?: acceptType;
    filter?: string;
}
interface SearchFilter extends Defaultfilter {
    title?: string;
    body?: string;
    q?: string;
}
