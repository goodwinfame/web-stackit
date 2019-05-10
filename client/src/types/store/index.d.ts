
namespace Store {
    declare enum viewState {
        none = "none", 
        list = "list", 
        detail = "detail"
    };
    declare enum inputState {
        none = "none", 
        typing = "typing"
    }
    declare enum listState {
        none = "none", 
        loading = "loading", 
        hasnext = "hasnext"
    }
    declare enum detailState {
        none = "none", 
        loading = "loading"
    }


    interface SearchParams {
        pageSize?: number;
        pageNum?: number;
        title?: string;
        body?: string;
        tagged?: string[];
        q?: string;
    }

    export interface Question {
        question_id: number;
        accepted_answer_id: number;
        title: string;
        body: string;
        score: number;
        answer_count: number;
        creation_date: Date;
        last_activity_date: Date;
        last_edit_date: Date;
        tags: string[];
    }
    
    export interface Answer {
        answer_id: number;
        body: string;
        is_accepted: boolean;
        question_id: number;
        creation_date: Date;
        last_activity_date: Date;
        last_edit_date: Date;
        score: number;
        tags: string[];
        title: string;
    }

    export type questionList = Question[]

    export type answerList = Answer[]
    
    export interface QuestionDetail extends Question {
        answers: answerList;
    }

    export interface MainView {
        value: number | null;
        state: viewState;
    }

    export interface QuestionListState {
        value: questionList;
        pageNum: number;
        state: listState;
    }
    
    export interface SearchInput {
        value: string;
        state: inputState;
    }
    
    export interface QuestionDetailState {
        value: QuestionDetail | null;
        state: detailState;
    }
    
    
    
    
    export interface State {
        mainView: MainView;
        searchInput: searchInput;
        questionList: QuestionListState;
    }

    export interface SetStateCallback<T> {
        (state: T): T
    }

    export interface Reducers{
        updateSearchInput(value?: string | SetStateCallback<SearchInput>, state?: inputState): void;
        updateView(state?: viewState | SetStateCallback<MainView>, value?: number | null): void;
        updateQuestionList(value?: questionList | SetStateCallback<QuestionListState>, pageNum?: number, state?: listState): void;
    }

    export type search = (params: SearchParams) => void;

    export interface GlobalContext extends State, Reducers{}
}
