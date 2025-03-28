import { Link } from 'react-router-dom';

function Home() {
  const problems = [
    {
      title: 'Santa Claus Problem',
      description: 'Simulate Santa coordinating with reindeer and elves.',
      path: '/santa-claus',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Roller Coaster Problem',
      description: 'Watch passengers board a roller coaster with limited seats.',
      path: '/roller-coaster',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Bridge Crossing Problem',
      description: 'See cars navigate a single-lane bridge.',
      path: '/bridge-crossing',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Sushi Bar Problem',
      description: 'Observe customers vying for seats at a sushi bar.',
      path: '/sushi-bar',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        IPC Simulations
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {problems.map((problem) => (
          <Link
            key={problem.title}
            to={problem.path}
            className={`${problem.bgColor} p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300`}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {problem.title}
            </h2>
            <p className="text-gray-700">{problem.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;