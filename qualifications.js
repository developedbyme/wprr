import HasTerm from "wprr/routing/qualification/wp/HasTerm";
import QualifyAll from "wprr/routing/qualification/QualifyAll";
import QualifyAny from "wprr/routing/qualification/QualifyAny";
import WpConditional from "wprr/routing/qualification/wp/WpConditional";
import WpData from "wprr/routing/qualification/wp/WpData";

let hasTerm = HasTerm.create;
let all = QualifyAll.create;
let any = QualifyAny.create;
let wpConditional = WpConditional.create;
let wpData = WpData.create;

export {hasTerm, all, any, wpConditional, wpData};