import React, {FormEvent, useEffect, useState} from 'react';
import './App.css';

const Message = ({ message, align, secondBest }: {message: string, align: 'right' | 'left', secondBest?: string}) => {
    const alignmentClass = align === 'right' ? '' : 'justify-end';
    const messageAlignmentClass = ''
    return (
        <div className={`flex ${alignmentClass} w-full`}>
            <div className="">
                <div
                    className={`ml-3 p-2 rounded-lg shadow-md text-white ${messageAlignmentClass} ${align === 'right' ? 'bg-blue-500' : 'bg-green-500'} `}
                >
                    <div>
                        {message}

                    </div>
                    {!!secondBest && <div className="mt-4 text-sm text-gray-200">
                        2nd Best: {secondBest}
                    </div>}
                </div>

            </div>

        </div>
    );
};

const baseApi = ""

function App() {
    const [isOpen, setIsOpen] = useState(false);

    const [knowledge, setKnowledge] = useState(['Loading...'])
    useEffect(() => {
        fetch(baseApi + "/data").then(x => x.json()).then(x => setKnowledge(x))
    }, []);
    const toggleExpander = () => {
        setIsOpen(!isOpen);
    };

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{message: string, secondBest?: string}[]>([
        {
            message:         'Welcome! Ask me about star wars characters and I will provide exact answers from my knowledge base'
        }
    ]);
    const sendMessage = async (event: FormEvent) => {
        event.preventDefault();
        setMessages([...messages, {message}])

        const response = await fetch(baseApi +"/query", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: message
            })
        } );

        const answers=  (await response.json())
        const answer = answers.answer[0];
        const displayAnswer = `(${Math.round(answer.score * 100)} confident lvl) ${answer.text}`

        const secondBestAnswer = answers.answer[1];
        const secondDisplayAnswer = `(${Math.round(secondBestAnswer.score * 100)} confident lvl) ${secondBestAnswer.text}`

        setMessages([...messages, {message}, {message: displayAnswer, secondBest: secondDisplayAnswer}])
        setMessage('');
    };
  return (
      <div className="flex flex-col h-screen justify-between">
          <div className="overflow-auto p-4 space-y-4">
              {messages.map((item, index) => (
                  <Message key={index} message={item.message} secondBest={item.secondBest} align={index % 2 ? 'left' : 'right'}/>
              ))}
          </div>
          <form onSubmit={sendMessage} className="p-4 bg-gray-200 flex w-full gap-x-2">
              <button type="button" onClick={toggleExpander} className="w-32 py-2 px-4 bg-orange-500 text-white rounded">
                  {isOpen && (
                      <div className="flex w-full">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                               stroke="currentColor" className="w-6 h-6">
                              <path
                                    d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"/>
                          </svg>

                          Hide
                      </div>
                  )}
                  {!isOpen && (
                      <div className="flex w-full">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                               stroke="currentColor" className="w-6 h-6">
                              <path d="m4.5 18.75 7.5-7.5 7.5 7.5"/>
                              <path  d="m4.5 12.75 7.5-7.5 7.5 7.5"/>
                          </svg>
                          See All
                      </div>
                  )}
              </button>
              <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Type your message..."
              />
              <button type="submit" className="p-2 bg-blue-500 text-white rounded">
                  Send
              </button>

          </form>

          <div className={`${isOpen ? '' : 'hidden'}`}>
              <ul className='list-inside list-disc m-4 p-4'>
              {knowledge.map((msg, index) => (
                  <li key={index}>{msg}</li>
              ))}
              </ul>
          </div>
      </div>
  )
}

export default App;
