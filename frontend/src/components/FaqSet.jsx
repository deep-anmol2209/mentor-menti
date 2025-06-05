import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import faqs from "@/data/faqs";
const FaqSet = ({ faq }) => {
  return (
    <div>
      <Accordion
        type='single'
        collapsible
        className="w-full"
        
      >
      {faqs.map((faq) => (
        <AccordionItem value={`item-${faq.id}`} key={faq.id}>
          <AccordionTrigger className='w-full text-md xl:text-2xl text-left hover:text-gray-400 transition-all duration-500'>{faq.question}</AccordionTrigger>
          <AccordionContent className='w-full text-xs text-left'>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
      </Accordion>
    </div>
  );
};

export default FaqSet;
