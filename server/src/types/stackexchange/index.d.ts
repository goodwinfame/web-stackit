

declare enum sortType {
    activity = "activity",
    votes = "votes",
    creation = "creation",
    relevance = "relevance"
}

declare enum orderType {
    desc = "desc",
    asc = "asc",
}
declare enum acceptType {
    'true' = 'True',
    'false' = 'False'
}

interface StackOptions {
    version: number;
}

interface Criteria {
    key: string;
    pagesize: number;
    sort: sortType;
    order: orderType;
    filter?: string;
    title?: string;
    body?: string;
    tagged?: string[];
    q?: string;
}

type ids = []

interface SearchQuestion {
    question_id: number;
    accepted_answer_id: number;
    accepted_answer: AcceptedAnswer;
    title: string;
    body: string;
    score: number;
    answer_count: number;
    creation_date: Date;
    last_activity_date: Date;
    last_edit_date: Date;
    tags: string[];
}

interface AcceptedAnswer{
    score: number;
    tags: string[];
    title: string;
}

interface Question extends SearchQuestion {
    
    answers: Answer[];
}

interface Answer {
    answer_id: number;
    title: string;
    body: string;
    is_accepted: boolean;
    score: number;
    tags: string[];
    question_id: number;
    creation_date: Date;
    last_activity_date: Date;
    last_edit_date: Date;
}

interface Results<T> {
    items: T[];
    page: number;
    page_size: number;
    total: number;
}

interface ResultsError {
    error_id: number;
    error_message: string;
    error_name: string;
}

interface Callback<T>{
    (err: ErrorEvent, results: Results<T> | ResultsError): void;
}

declare class Stackexchange {
    public constructor(options: StackOptions);
    public config: any;
    public search: Search;
    public questions: Questions;
    public answers: Answers;
    public users: Users;
    public tags: Tags;
}

declare interface Search {
    search(criteria: Criteria, callback: Callback<SearchQuestion>): void;
    advanced(criteria: Criteria, callback: Callback<SearchQuestion>): void;
}

declare interface Questions {
    questions(criteria: Criteria, callback: Callback<Question>, ids?: number[]): void;
    answers(): void;
    upvote(): void;
    downvote(): void;
}

declare interface Answers {
    answers(criteria: Criteria, callback: Callback<Answer>, ids?: number[]): void;
    upvote(): void;
    downvote(): void;
}

declare interface Users {
    users(): void;
    answers(): void;
}

declare interface Tags {
    tags(): void;
    info(): void;
    moderatorOnly(): void;
    required(): void;
    synonyms(): void;
    faq(): void;
    related(): void;
    tagsSynonyms(): void;
    topAnswerers(): void;
    topAskers(): void;
    wiki(): void;
}

declare module "stackexchange" {
    export = Stackexchange
}