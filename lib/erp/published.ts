import type {Reference} from './reference';
/** Keep published raw grades intact; never derive GPA or substitute tracker marks. */
export function publishedYears(d:Pick<Reference,'historical_course_results'|'current_school_snapshots'|'primary_school_results'>){return [...new Set([...d.historical_course_results,...d.current_school_snapshots,...d.primary_school_results].map(r=>r.school_year))].sort().reverse();}
export function publishedColumns(rows:{results:Record<string,unknown>}[]){return ['Q1','Q2','Q3','Q4','Quarter Average','Comp/Final Exam','Final Grade'].filter(c=>rows.some(r=>Object.hasOwn(r.results,c)));}
