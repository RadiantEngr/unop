const mailchimpClient = require("@mailchimp/mailchimp_transactional")(
    "md-GvN82FFThNQJbEvfl_QuJA"
);

export default {
  sendTemplateEmail: (
    templateName: string,
    subject: string,
    sender: string,
    recipients: { email: string }[],
    globalMergeVars: {name: string, content: any}[]
  ) => {
    try {      
      return mailchimpClient.messages.sendTemplate({
        template_name: templateName,
        template_content: [],
        message: {
          subject : subject,
          from_email : sender,
          from_name: 'Unox',
          to : recipients,
          global_merge_vars: globalMergeVars
        }
      })
    } catch (err) {
      console.log("Error occured while sending mail: ", err );
    }
  },
};
