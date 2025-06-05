// pages/theme-showcase.jsx
import React from 'react';

const ThemeShowcasePage = () => {
  return (
    <div className="min-h-screen bg-backgroundLight text-textPrimary p-8 md:p-12">
      <h1 className="text-5xl font-extrabold text-primary mb-10 text-center">
        My Tailwind Theme Showcase
      </h1>

      {/* --- Colors --- */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold text-secondary mb-6 border-b-2 border-accent pb-2">
          Colors
        </h2>
        <p className="text-textSecondary mb-8 text-lg">
          These are the custom color palettes defined in your theme.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: 'Primary', class: 'bg-primary', hex: '#3B82F6' },
            { name: 'Secondary', class: 'bg-secondary', hex: '#2563EB' },
            { name: 'Accent', class: 'bg-accent', hex: '#FBBF24' },
            { name: 'Muted', class: 'bg-muted', hex: '#6B7280' },
            { name: 'Text Primary', class: 'bg-textPrimary', hex: '#111827' },
            { name: 'Text Secondary', class: 'bg-textSecondary', hex: '#374151' },
            { name: 'Text Muted', class: 'bg-textMuted', hex: '#6B7280' },
            { name: 'Background Light', class: 'bg-backgroundLight border border-gray-300', hex: '#F9FAFB' },
            { name: 'Background Dark', class: 'bg-backgroundDark text-white', hex: '#1F2937' },
            { name: 'Success', class: 'bg-success', hex: '#10B981' },
            { name: 'Danger', class: 'bg-danger', hex: '#EF4444' },
            { name: 'Warning', class: 'bg-warning', hex: '#F59E0B' },
          ].map((color) => (
            <div key={color.name} className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-lg ${color.class}`}></div>
              <div>
                <p className="font-semibold text-lg">{color.name}</p>
                <p className="text-sm text-textMuted">{color.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Typography --- */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold text-secondary mb-6 border-b-2 border-accent pb-2">
          Typography
        </h2>
        <p className="text-textSecondary mb-8 text-lg">
          Explore the custom font families and text colors.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-3xl font-semibold mb-4 text-primary">Font Families</h3>
            <div className="space-y-4">
              <p className="font-sans text-xl text-textPrimary">
                <span className="font-bold">font-sans:</span> The quick brown fox jumps over the lazy dog.
              </p>
              <p className="font-caligraphy text-3xl text-caligraphy">
                <span className="font-bold">font-caligraphy:</span> The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-semibold mb-4 text-primary">Text Colors</h3>
            <div className="space-y-4">
              <p className="text-primary text-xl">
                <span className="font-bold">text-primary:</span> This text uses the primary text color.
              </p>
              <p className="text-secondary text-xl">
                <span className="font-bold">text-secondary:</span> This text uses the secondary text color.
              </p>
              <p className="text-muted text-xl">
                <span className="font-bold">text-muted:</span> This text uses the muted text color.
              </p>
              <p className="font-caligraphy text-caligraphy text-xl">
                <span className="font-bold">text-caligraphy:</span> This text uses the caligraphy text color.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Background Colors --- */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold text-secondary mb-6 border-b-2 border-accent pb-2">
          Background Colors
        </h2>
        <p className="text-textSecondary mb-8 text-lg">
          These are the custom background colors available.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: 'Primary', class: 'bg-primary text-white' },
            { name: 'Secondary', class: 'bg-secondary text-white' },
            { name: 'Accent', class: 'bg-accent text-textPrimary' },
            { name: 'Muted', class: 'bg-muted text-textPrimary' },
            { name: 'Background Light', class: 'bg-backgroundLight border border-gray-300 text-textPrimary' },
            { name: 'Background Dark', class: 'bg-backgroundDark text-white' },
          ].map((bgColor) => (
            <div key={bgColor.name} className={`h-32 flex items-center justify-center rounded-lg shadow-md ${bgColor.class}`}>
              <p className="font-semibold text-lg">{bgColor.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Box Shadows --- */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold text-secondary mb-6 border-b-2 border-accent pb-2">
          Box Shadows
        </h2>
        <p className="text-textSecondary mb-8 text-lg">
          These are the custom box shadows you&apos;ve defined.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: 'Primary Shadow', class: 'shadow-primary' },
            { name: 'Secondary Shadow', class: 'shadow-secondary' },
            { name: 'Accent Shadow', class: 'shadow-accent' },
          ].map((shadow) => (
            <div key={shadow.name} className={`h-32 bg-white rounded-lg flex items-center justify-center ${shadow.class}`}>
              <p className="font-semibold text-textPrimary text-lg">{shadow.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Combinations and Components (Examples) --- */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold text-secondary mb-6 border-b-2 border-accent pb-2">
          Combinations & Components
        </h2>
        <p className="text-textSecondary mb-8 text-lg">
          Here are some examples of how your theme can be combined to create common UI elements.
        </p>

        <div className="space-y-12">
          {/* Card Example */}
          <div className="bg-backgroundLight p-6 rounded-lg shadow-primary flex flex-col items-start">
            <h3 className="text-2xl font-bold text-textPrimary mb-2">Card Title</h3>
            <p className="text-textSecondary mb-4">
              This is a sample card demonstrating the combination of background, text, and shadow.
            </p>
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200">
              Call to Action
            </button>
          </div>

          {/* Alert Examples */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-success text-white shadow-secondary">
              <p className="font-bold text-lg">Success Alert!</p>
              <p>Your operation was completed successfully.</p>
            </div>
            <div className="p-4 rounded-lg bg-danger text-white shadow-danger">
              <p className="font-bold text-lg">Danger Alert!</p>
              <p>Something went wrong. Please try again.</p>
            </div>
            <div className="p-4 rounded-lg bg-warning text-textPrimary shadow-accent">
              <p className="font-bold text-lg">Warning Alert!</p>
              <p>This action has a potential impact.</p>
            </div>
          </div>

          {/* Heading with Caligraphy */}
          <div className="text-center">
            <h3 className="font-caligraphy text-caligraphy text-5xl mb-4">
              Elegant Heading
            </h3>
            <p className="text-textMuted text-lg">
              A touch of unique style with your custom calligraphy font.
            </p>
          </div>
        </div>
      </section>

      <footer className="text-center text-textMuted mt-16 text-sm">
        Theme Showcase built with Next.js and Tailwind CSS
      </footer>
    </div>
  );
};

export default ThemeShowcasePage;