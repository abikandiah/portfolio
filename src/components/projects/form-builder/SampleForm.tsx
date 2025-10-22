import { FieldApi, useForm } from '@tanstack/react-form';

const type = {
    a: 'a',
    aa: 'aa',
    ab: 'ab'
} as const;

type TType = (typeof type)[keyof typeof type];

const defaultValues: { name: string; type: TType; checked: boolean } = {
    name: '',
    type: type.a,
    checked: false,
};

function SampleForm() {
    const form = useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
            alert(`Success! Submitted data: ${JSON.stringify(value, null, 2)}`);
            form.reset();
        },
    });

    return (
        <div className="flex justify-center items-center">
            <form
                // Connect TanStack's handleSubmit to the native form event
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="p-8 rounded border-container space-y-4"
            >
                <h2 className="text-xl font-light text-center">
                    Send a Message
                </h2>

                {/* --- Name Field --- */}
                <form.Field
                    name="name"
                    // Basic validation: must not be empty
                    validators={{
                        onChange: ({ value }) =>
                            !value ? 'A name is required.' : undefined,
                    }}
                    children={(field) => (
                        <div className="">
                            <label
                                htmlFor={field.name}
                                className="block text-sm text-gray-500 mb-1"
                            >
                                Your Name
                            </label>
                            <input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                type="text"
                                placeholder="John Doe"
                                className={`
                  w-full px-3 py-1 border rounded focus:outline-none transition duration-150 ease-in-out text-sm
                  ${field.state.meta.errors.length > 0 ?
                                        'border-red-500 focus:ring-red-500' :
                                        'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }
                `}
                            />
                            <FieldError field={field} />
                        </div>
                    )}
                />

                {/* --- Email Field --- */}
                <form.Field
                    name="type"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? 'A name is required.' : undefined,
                    }}
                    children={(field) => (
                        <div className="mb-6">
                            <label
                                htmlFor={field.name}
                                className="block text-sm text-gray-500 mb-1"
                            >
                                Email Address
                            </label>
                            <input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                type="email"
                                placeholder="you@example.com"
                                className={`
                  w-full px-4 py-2 border rounded-lg focus:outline-none 
                  transition duration-150 ease-in-out
                  ${field.state.meta.errors.length > 0 ?
                                        'border-red-500 focus:ring-red-500' :
                                        'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }
                `}
                            />
                            <FieldError field={field} />
                        </div>
                    )}
                />

                {/* --- Message Field --- */}
                <form.Field
                    name="message"
                    children={(field) => (
                        <div className="mb-8">
                            <label
                                htmlFor={field.name}
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Message
                            </label>
                            <textarea
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                rows={4}
                                placeholder="What can we help you with?"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-none"
                            />
                        </div>
                    )}
                />

                {/* --- Submit Button --- */}
                <form.Subscribe
                    // Subscribe only to state necessary to control the button
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <button
                            type="submit"
                            disabled={!canSubmit || isSubmitting}
                            className={`
                w-full font-semibold py-3 rounded-lg transition duration-300 ease-in-out 
                ${canSubmit
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-[1.01]'
                                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                }
              `}
                        >
                            {isSubmitting ? 'Submitting...' : 'Send Message'}
                        </button>
                    )}
                />
            </form>
        </div>
    );
};

// A reusable component to display validation errors
function FieldError({ field }: { field: FieldApi<any, any, any, any> }) {
    return (
        <>
            {field.state.meta.errors.length > 0 && (
                <em className="text-red-500 text-sm mt-1 block">
                    {field.state.meta.errors.join(', ')}
                </em>
            )}
        </>
    );
}

export { SampleForm };

