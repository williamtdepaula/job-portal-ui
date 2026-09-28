const sections = [
  {
    title: 'What Are Cookies',
    body: "Cookies are small text files stored on your device when you visit JobPortal. They help us recognize your browser, remember your preferences, and keep you signed in between visits.",
  },
  {
    title: 'How We Use Cookies',
    body: 'We use cookies to keep you logged in, remember your theme and search preferences, understand how the site is used so we can improve it, and measure the performance of job listings and features.',
  },
  {
    title: 'Types of Cookies We Use',
    list: [
      'Essential cookies — required for core functionality like authentication and saved jobs.',
      'Preference cookies — remember settings such as dark mode.',
      'Analytics cookies — help us understand aggregate usage patterns to improve JobPortal.',
    ],
  },
  {
    title: 'Managing Cookies',
    body: 'Most browsers let you view, delete, and block cookies through their settings. Disabling essential cookies may prevent parts of JobPortal, such as staying signed in, from working correctly.',
  },
  {
    title: 'Changes to This Policy',
    body: "We may update this Cookie Policy from time to time. Any changes will be posted on this page.",
  },
];

const CookiePolicy = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 relative transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-purple-200/30 dark:from-primary-600/10 dark:to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-blue-200/30 to-purple-200/30 dark:from-blue-600/10 dark:to-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-purple-600 to-primary-800 bg-clip-text text-transparent mb-2">
            Cookie Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Last updated: September 28, 2026
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 space-y-8 transition-colors duration-300">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {section.title}
              </h2>
              {section.body && (
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {section.body}
                </p>
              )}
              {section.list && (
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
