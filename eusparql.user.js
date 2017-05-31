// ==UserScript==
// @name         SPARQLs
// @namespace    lbsprql
// @version      0.9
// @description  Enhances http://publications.europa.eu/webapi/rdf/sparql with CODEMIRROR (http://codemirror.net/2/)
// @author       Ladislav Behal
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @require      https://raw.githubusercontent.com/lbehal/Sparql/master/codemirror.js
// @require      https://raw.githubusercontent.com/lbehal/Sparql/master/formatting.js
// @require      http://codemirror.net/2/lib/util/foldcode.js
// @require      https://raw.githubusercontent.com/codemirror/CodeMirror/master/addon/hint/show-hint.js
// @require      https://raw.githubusercontent.com/lbehal/Sparql/master/codemirror-compressed.js
// @require      https://raw.githubusercontent.com/codemirror/CodeMirror/master/addon/edit/matchbrackets.js
// @match        http://publications.europa.eu/webapi/rdf/sparql
// @resource     codemirror_CSS https://raw.githubusercontent.com/lbehal/Sparql/master/codemirror.css
// @resource     atjs_CSS https://raw.githubusercontent.com/codemirror/CodeMirror/master/addon/hint/show-hint.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

(function() {
	'use strict';

	var cm_CssSrc = GM_getResourceText("codemirror_CSS");
	GM_addStyle (cm_CssSrc);

	var cm_atjs_CSS = GM_getResourceText("atjs_CSS");
	GM_addStyle (cm_atjs_CSS);


	var myTextArea = $("#query");
	var foldFunc = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder);

	function synonyms(cm, option) {
		return new Promise(function(accept) {
			setTimeout(function() {
				var cursor = cm.getCursor(), line = cm.getLine(cursor.line);
				var start = cursor.ch, end = cursor.ch;
				while (start && /\w/.test(line.charAt(start - 1))) --start;
				while (end < line.length && /\w/.test(line.charAt(end))) ++end;
				var word = line.slice(start, end).toLowerCase();
				var result = new Array();
				for (var i = 0; i < suggests.length; i++)
				{
					if (suggests[i].indexOf(word) != -1)
					{
						//add to sugest list
						result.push(suggests[i]);
					}				
				}
				if(result.length > 0)
				{
					return accept({list: result,
								   from: CodeMirror.Pos(cursor.line, start),
								   to: CodeMirror.Pos(cursor.line, end)});
				}
				else
					return accept(null);
			}, 100);
		});
	}

	var myCodeMirror = CodeMirror.fromTextArea(myTextArea.get(0),  { 
		//value: "prefix cdm: <http://publications.europa.eu/ontology/cdm#>\nselect * \nwhere\n {\n  ?s ?p ?o\n }\n",
		mode:  "sparql",
		lineNumbers: true,
		lineWrapping: true,
		matchBrackets: true,
		viewportMargin: Infinity,
		onGutterClick: foldFunc,
		extraKeys: {
			"Ctrl-Q": function(cm){foldFunc(cm, cm.getCursor().line);},
			"Ctrl-Space": "autocomplete"
		},
		hintOptions: {hint: synonyms}
	});
	CodeMirror.commands["selectAll"](myCodeMirror);
	myCodeMirror.autoFormatRange({line:0, ch:0}, {line:myCodeMirror.lineCount(), ch:myCodeMirror.getTextArea().value.length});   

	$('.CodeMirror').css("border","1px solid #eee");

	var form = $("#main > form > fieldset > label:nth-child(6)");
	$("#main > form > fieldset > label:nth-child(6)").append(". Ctrl+Space for code completion ");
	var button = $("<button type=\"button\">Reformat</button>");
	button.click(function()
				 {
		var editor= $('.CodeMirror')[0].CodeMirror;    

		var totalLines = editor.lineCount();
		var totalChars = editor.getTextArea().value.length;

		editor.autoFormatRange({line:0, ch:0}, {line:totalLines, ch:totalChars});   
	}
				);
	button.appendTo(form);

	var suggests = ["resource_legal_addresses_agent", "resource_legal_addresses_institution", "resource_legal_addresses_organization", "question_parliamentary_asked_by_group_parliamentary", "communication_case_new_requests_annulment_of_resource_legal", "communication_case_new_requests_establishment_of_failure_of_obligation_resource_legal", "communication_case_new_requests_inapplicability_resource_legal", "communication_case_new_requests_partial_annulment_of_resource_legal", "communication_case_new_requests_review_of_decision_case-law", "communication_case_new_submits_preliminary_question_resource_legal", "communication_cjeu_communicates_on_case-law", "communication_request_opinion_requests_opinion_on_resource_legal", "communication_cjeu_requested_by_agent", "decision_service_associated", "directive_service_associated", "document_com_other_ec_service_associated", "proposal_act_service_associated", "regulation_service_associated", "staff-working-document_service_associated", "work_created_by_agent", "legislation_secondary_is_about_concept_directory-code", "resource_legal_is_about_concept_directory-code", "resource_legal_amended_by_case-law", "resource_legal_annulment_requested_by_case-law", "resource_legal_application_deferred_by_case-law", "resource_legal_application_suspended_by_case-law", "resource_legal_confirmed_by_case-law", "resource_legal_declared_valid_by_case-law", "resource_legal_declared_void_by_case-law", "resource_legal_declared_void_by_preliminary_ruling_case-law", "resource_legal_establishes_failure_to_fulfill_obligation_requested_by_case-law", "resource_legal_failure_stated_by_case-law", "resource_legal_immediately_enforced_by_case-law", "resource_legal_incidentally_declared_valid_case-law", "resource_legal_incidentally_declared_void_by_case-law", "resource_legal_interpretation_requested_by_case-law", "resource_legal_interpreted_by_case-law", "resource_legal_interpreted_by_judgement_case-law", "resource_legal_opinion_requested_by_case-law", "resource_legal_partially_annulled_by_case-law", "resource_legal_reviewed_by_case-law", "resource_legal_validation_requested_by_case-law", "resource_legal_affected_by_case-law", "resource_legal_judgement_corrected_by_case-law", "work_cites_work", "resource_legal_comment_internal", "resource_legal_is_about_subject-matter", "act_preparatory_date_debate", "work_is_about_concept_eurovoc", "work_date_document", "communication_cjeu_defended_by_agent", "resource_legal_date_dispatch", "resource_legal_date_deadline", "resource_legal_id_celex", "resource_legal_id_obsolete_document", "treaty_stored_by_agent", "agreement_international_stored_by_agent", "legislation_complementary_stored_by_agent", "resource_legal_number_sequence_celex", "resource_legal_number_corrigendum", "resource_legal_number_natural_celex", "resource_legal_year", "resource_legal_id_sector", "resource_legal_type", "resource_legal_contains_cor_opinion_on_resource_legal", "resource_legal_contains_eesc_opinion_on_resource_legal", "resource_legal_contains_ep_opinion_on_resource_legal", "resource_legal_date_end-of-validity", "resource_legal_has_type_act_concept_type_act", "work_has_resource-type", "agreement_international_has_type_comment_concept_type_comment", "document_com_other_ec_id_com", "fragment_resource_legal_id_fragment", "resource_legal_id_local", "resource_legal_id_obsolete_notice", "work_complex_work_group_id", "work_id", "work_id_document", "work_id_obsolete_notice", "proposal_act_id_com", "staff-working-document_id_com", "resource_legal_date_entry-into-force", "event_legal_based_on_resource_legal", "event_based_on_resource_legal", "procedure_code_interinstitutional_based_on_resource_legal", "procedure_without_code_interinstitutional_based_on_resource_legal", "resource_legal_based_on_resource_legal", "resource_legal_based_on_treaty", "resource_legal_uses_originally_language", "question_parliamentary_term_parliamentary", "resolution_legislative_term_parliamentary", "resolution_legislative_ep_term_parliamentary", "resolution_other_ep_term_parliamentary", "text-adopted_term_parliamentary", "resource_legal_date_request_opinion", "resource_legal_added_to_resource_legal", "resource_legal_completed_by_resource_legal", "legislation_secondary_modified_by_legislation_secondary", "resource_legal_adopted_by_resource_legal", "resource_legal_amended_by_resource_legal", "resource_legal_application_deferred_by_resource_legal", "resource_legal_application_extended_by_resource_legal", "resource_legal_confirmed_by_resource_legal", "resource_legal_corrected_by_resource_legal", "resource_legal_derogated_by_resource_legal", "resource_legal_implemented_by_resource_legal", "resource_legal_implicitly_repealed_by_resource_legal", "resource_legal_interpreted_authoritatively_by_resource_legal", "resource_legal_partially_adopted_by_resource_legal", "resource_legal_partially_referred_to_resource_legal", "resource_legal_partially_suspended_by_resource_legal", "resource_legal_reestablished_by_resource_legal", "resource_legal_rendered_obsolete_by_resource_legal", "resource_legal_repealed_by_resource_legal", "resource_legal_suspended_by_resource_legal", "resource_legal_validity_extended_by_resource_legal", "work_related_to_work", "resource_legal_amendment_proposed_by_resource_legal", "resource_legal_information_miscellaneous", "resource_legal_adds_to_resource_legal", "resource_legal_completes_resource_legal", "resource_legal_confirms_resource_legal", "resource_legal_defers_application_of_resource_legal", "resource_legal_related_question_to_resource_legal", "resource_legal_related_to_resource_legal", "legislation_secondary_modifies_legislation_secondary", "resource_legal_adopts_resource_legal", "resource_legal_amends_resource_legal", "resource_legal_corrects_resource_legal", "resource_legal_derogates_resource_legal", "resource_legal_extends_application_resource_legal", "resource_legal_extends_validity_of_resource_legal", "resource_legal_implements_resource_legal", "resource_legal_implicitly_repeals_resource_legal", "resource_legal_interpretes_authoritatively_resource_legal", "resource_legal_partially_adopts_resource_legal", "resource_legal_partially_refers_to_resource_legal", "resource_legal_partially_suspends_resource_legal", "resource_legal_proposes_to_amend_resource_legal", "resource_legal_reestablishes_resource_legal", "resource_legal_renders_obsolete_resource_legal", "resource_legal_repeals_resource_legal", "resource_legal_replaces_resource_legal", "resource_legal_suspends_resource_legal", "resource_legal_tackles_similar_question_as_resource_legal", "legislation_secondary_date_notification", "directive_implemented_by_measure_national_implementing	NIM", "expression_title_alternative", "act_other_cor_number_session", "act_other_eesc_number_session", "opinion_consultation_cor_number_session", "opinion_consultation_eesc_number_session", "opinion_eesc_number_session", "opinion_other_cor_number_session", "opinion_other_eesc_number_session", "question_parliamentary_number_session", "resource_legal_published_in_official-journal", "resource_legal_published_in_special-official-journal", "communication_cjeu_has_type_procedure_concept_type_procedure", "resource_legal_position_eesc", "question_parliamentary_date_reply", "act_legislative_other_oj_c_service_responsible", "act_legislative_other_oj_l_service_responsible", "decision_service_responsible", "directive_service_responsible", "document_com_other_ec_service_responsible", "non-opposition_concentration_notified_service_responsible", "non-opposition_joint-venture_notified_service_responsible", "proposal_act_service_responsible", "regulation_service_responsible", "staff-working-document_service_responsible", "resource_legal_date_signature", "resource_legal_cor_opinion_contained_in_resource_legal", "resource_legal_eesc_opinion_contained_in_resource_legal", "resource_legal_ep_opinion_contained_in_resource_legal", "resource_legal_received_opinion_cjeu", "expression_title", "work_table-of-contents", "cooperation_police-and-judicial_date_transposition", "decision_date_transposition", "directive_date_transposition", "recommendation_date_transposition", "recommendation_ecsc_date_transposition", "regulation_date_transposition", "resource_legal_based_on_concept_treaty", "resource_legal_date_vote", "resource_legal_in-force", "work_date_creation", "work_date_creation_legacy",
					"^^xsd:integer",
					"^^xsd:decimal",
					"^^xsd:float",
					"^^xsd:double",
					"^^xsd:string",
					"^^xsd:boolean",
					"^^xsd:dateTime",
					"^^xsd:nonPositiveInteger",
					"^^xsd:negativeInteger",
					"^^xsd:long",
					"^^xsd:int",
					"^^xsd:short",
					"^^xsd:byte",
					"^^xsd:nonNegativeInteger",
					"^^xsd:unsignedLong",
					"^^xsd:unsignedInt",
					"^^xsd:unsignedShort",
					"^^xsd:unsignedByte",
					"^^xsd:positiveInteger",
					"str", "lang", "langmatches", "datatype", "bound", "sameterm", "isiri", "isuri",
					"iri", "uri", "bnode", "count", "sum", "min", "max", "avg", "sample",
					"group_concat", "rand", "abs", "ceil", "floor", "round", "concat", "substr", "strlen",
					"replace", "ucase", "lcase", "encode_for_uri", "contains", "strstarts", "strends",
					"strbefore", "strafter", "year", "month", "day", "hours", "minutes", "seconds",
					"timezone", "tz", "now", "uuid", "struuid", "md5", "sha1", "sha256", "sha384",
					"sha512", "coalesce", "if", "strlang", "strdt", "isnumeric", "regex", "exists",
					"isblank", "isliteral", "a", "bind",
					"base", "prefix", "select", "distinct", "reduced", "construct", "describe",
					"ask", "from", "named", "where", "order", "limit", "offset", "filter", "optional",
					"graph", "by", "asc", "desc", "as", "having", "undef", "values", "group",
					"minus", "in", "not", "service", "silent", "using", "insert", "delete", "union",
					"true", "false", "with",
					"data", "copy", "to", "move", "add", "create", "drop", "clear", "load"
				   ];


})();
