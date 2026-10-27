import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildReferenceEntries} from '../lib/erp/reference.ts';
import {gradeSummary,validate,type Course,type Result,type Report,type Entry} from '../lib/erp/academic.ts';

export function fixture(){return {
 schema_version:'academic-reference-1.0',prepared_on:'2026-10-27',student:{name:'Synthetic Student',school_student_id:'QA'},
 source_documents:[{id:'QA1',name:'synthetic.pdf',sha256:'a'.repeat(64),bytes:20,included_as_student_record:true}],
 historical_course_results:[{school_year:'2024-2025',grade:7,course:'Biology 7',source_id:'QA1',results:{'Final Grade':{raw:'B/83',letter:'B',score:83,status:'reported'}}}],
 primary_school_results:[{school_year:'2023-2024',grade:6,semester:2,subject_raw:'Science',final_exam_raw:'--',comprehensive_evaluation_raw:'A',source_id:'QA1'}],
 current_school_snapshots:[{id:'R-G9-ECON-MQ1',school_year:'2026-2027',course:'AP Economics',class_code_raw:'QA',teacher_raw:'Synthetic',reported_percent:92,reported_letter:'A-',printed_date:'2026-09-14',source_ids:['QA1']}],
 category_summaries:[{report_id:'R-G9-ECON-MQ1',source_id:'QA1',category_raw:'Test',points_earned:87,points_possible:100,reported_percent:87,reported_letter:'B+'}],
 assignments:[{id:'QA001',report_id:'R-G9-ECON-MQ1',source_id:'QA1',date:'2026-09-14',category_raw:'Test',title:'Synthetic blank exam',score:null,points_possible:100,reported_percent:null,reported_letter:null,score_status:'blank_in_source',note:'No score shown'}],
 handwritten_tracker:{source_id:'QA1',school_year:'2026-2027',columns:[{label:'Mark 1',date:null,date_status:'unknown'},{label:'Mark 2',date:null,date_status:'unknown'},{label:'Mark 3',date:'2026-10-09',date_status:'assumed_at_parent_request'}],rows:[{course_raw:'Econ',display_course:'Economics',marks:[91,92,94],mark3_confirmation:null},{course_raw:'Chi',display_course:'Chinese',marks:[95,96,95],mark3_confirmation:'Parent confirmed'}]},
 standardized_assessments:[{subject:'Reading',term:'Spring 2026',grade:8,rit_score:248,achievement_percentile:96,growth_percentile:99,source_id:'QA1'}],
 summer_report:{source_id:'QA1',date:'2024-08-10',course:'Synthetic Summer',competencies:[{name:'Expression',rating:'PM4'}]},issues:[]
};}
test('source reference import is deterministic and separates snapshots from assignments',()=>{
 const a=buildReferenceEntries(fixture()),b=buildReferenceEntries(fixture());assert.deepEqual(a,b);
 assert.equal(a.entries.filter(e=>e.kind==='result').length,1);assert.equal(a.entries.filter(e=>e.kind==='report').length,1);
 assert.equal(a.entries.filter(e=>e.kind==='course').length,3);
});
test('unknown weights, credits, dates and blank scores remain unknown',()=>{
 const {entries}=buildReferenceEntries(fixture());
 const course=entries.find(e=>e.kind==='course'&&(e.body as Course).level==='AP')!.body as Course;
 const result=entries.find(e=>e.kind==='result')!.body as Result;
 assert.equal(course.credits,null);assert.equal(course.policy.categories[0].weight,null);assert.equal(course.policy.confirmed,false);
 assert.equal(result.status,'unknown');assert.equal(result.score,null);assert.equal(result.maximum,100);
 assert.equal(gradeSummary(course,entries.filter(e=>e.kind==='result') as Entry<Result>[]).score,null);
 assert.ok(entries.filter(e=>e.kind==='term').every(e=>(e.body as any).start===null));
 const report=entries.find(e=>e.kind==='report')!.body as Report;
 const tracker=(report.data as any).handwritten_tracker;assert.equal(tracker.columns[0].date,null);assert.equal(tracker.columns[2].date_status,'assumed_at_parent_request');assert.equal(tracker.rows[1].marks[2],95);
});
test('numeric assignment retains the original letter grade',()=>{
 const f=fixture();Object.assign(f.assignments[0],{score:87,reported_percent:87,reported_letter:'B+',score_status:'reported'});
 const r=buildReferenceEntries(f).entries.find(e=>e.kind==='result')!.body as Result;assert.equal(r.score,87);assert.equal(r.grade,'B+');assert.equal(r.status,'graded');
});
test('missing sources, inconsistent blank status and invalid assignment dates reject',()=>{
 const a=fixture();a.assignments[0].source_id='missing';assert.throws(()=>buildReferenceEntries(a));
 const b=fixture();b.assignments[0].score_status='reported';assert.throws(()=>buildReferenceEntries(b));
 const c=fixture();c.assignments[0].date='2026-02-30';assert.throws(()=>buildReferenceEntries(c));
});
test('unknown weights cannot be confirmed for calculation',()=>{
 const {entries}=buildReferenceEntries(fixture());const c=structuredClone(entries.find(e=>e.kind==='course')!.body as Course);c.policy.confirmed=true;assert.throws(()=>validate('course',c));
});
