interface Props { onAccept: () => void }

export function AuthDisclaimer({ onAccept }: Props) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="panel max-w-lg w-full p-6 border-cryo-yellow/40" style={{ borderColor: 'rgba(255,204,0,0.4)' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-cryo-yellow text-lg">⚠</span>
          <h2 className="text-cryo-yellow font-bold text-sm tracking-wide uppercase">
            Authorized Use Only
          </h2>
        </div>

        <div className="space-y-3 text-xs text-cryo-text leading-relaxed mb-6">
          <p>
            The Password Testing Suite is an offensive security tool intended exclusively
            for authorized penetration testing and security assessments.
          </p>
          <p>
            By proceeding, you confirm that:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-cryo-muted">
            <li>You have <strong className="text-cryo-text">explicit written authorization</strong> from
              the system/account owner before testing any live system or network target.</li>
            <li>Hash cracking is only performed on hashes you are authorized to test.</li>
            <li>You understand that unauthorized use may violate the <strong className="text-cryo-text">
              Computer Fraud and Abuse Act (CFAA)</strong>, the <strong className="text-cryo-text">
              Computer Misuse Act</strong>, or equivalent laws in your jurisdiction.</li>
            <li>This tool is for <strong className="text-cryo-text">defensive and authorized red team
              purposes only</strong>.</li>
          </ul>
          <p className="text-cryo-muted">
            This confirmation expires every 90 days as a reminder of your obligations.
          </p>
        </div>

        <button className="btn btn-primary w-full justify-center" onClick={onAccept}>
          I have written authorization — Proceed
        </button>
      </div>
    </div>
  )
}
