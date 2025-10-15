'use client';

import React, { useState } from 'react';
import { Upload, CheckCircle2, FileText, AlertCircle, X, Download, Filter } from 'lucide-react';

interface Checkpoint {
  id: number;
  section: string;
  title: string;
  status: 'passed' | 'review' | 'failed';
  clause: string;
  description: string;
}

type TabType = 'base' | 'plus' | 'code';
type FilterStatus = 'all' | 'passed' | 'review' | 'failed';

export default function StarlineComplianceMockup() {
  const [activeTab, setActiveTab] = useState<TabType>('code');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<string[]>([]);
  const [processStarted, setProcessStarted] = useState<boolean>(false);
  const [processComplete, setProcessComplete] = useState<boolean>(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const jurisdictions = [
    'Global Standards (ISO 9001)',
    'National Building Code (Section A-D)',
    'State Regulations (Fire Safety Grade)',
    'Local Municipal Rules (Zoning Compliance)'
  ];

  const checkpoints: Checkpoint[] = [
    {
      id: 1,
      section: 'Egress & Safety',
      title: 'Emergency Exit Width',
      status: 'passed',
      clause: 'NBC Section 4.2.1',
      description: 'Emergency exits must be minimum 1.1m wide. Current design: 1.5m ✓'
    },
    {
      id: 2,
      section: 'Egress & Safety',
      title: 'Staircase Dimensions',
      status: 'passed',
      clause: 'NBC Section 4.3.2',
      description: 'Staircase width 1.5m and tread depth 0.3m compliant ✓'
    },
    {
      id: 3,
      section: 'Fire Safety',
      title: 'Fire Resistance Rating',
      status: 'review',
      clause: 'Fire Code Section 6.1',
      description: 'Requires 2-hour fire rating. Specification needs verification.'
    },
    {
      id: 4,
      section: 'Fire Safety',
      title: 'Fire Extinguisher Placement',
      status: 'passed',
      clause: 'Fire Code Section 6.5',
      description: 'Spacing ≤ 20m maintained throughout. 8 units placed ✓'
    },
    {
      id: 5,
      section: 'Accessibility',
      title: 'Wheelchair Accessibility',
      status: 'failed',
      clause: 'State Regulations 3.1.4',
      description: 'Main entrance ramp gradient 1:8 required, current 1:6. Remediation needed.'
    },
    {
      id: 6,
      section: 'Accessibility',
      title: 'Accessible Parking',
      status: 'passed',
      clause: 'State Regulations 3.2.1',
      description: '2 accessible parking spaces provided as required ✓'
    },
    {
      id: 7,
      section: 'Ventilation',
      title: 'Natural Ventilation Rate',
      status: 'passed',
      clause: 'NBC Section 5.1.2',
      description: 'Minimum 2 air changes/hour achieved through windows ✓'
    },
    {
      id: 8,
      section: 'Ventilation',
      title: 'Indoor Air Quality',
      status: 'review',
      clause: 'ISO 7730',
      description: 'CO2 levels need continuous monitoring during operation.'
    },
    {
      id: 9,
      section: 'Structural',
      title: 'Load Calculations',
      status: 'passed',
      clause: 'NBC Section 2.1',
      description: 'Live load 2.5 kPa and dead load calculations verified ✓'
    },
    {
      id: 10,
      section: 'Structural',
      title: 'Column Spacing',
      status: 'review',
      clause: 'Structural Code 2.3',
      description: 'Verify 6m spacing meets building regulations.'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setUploadedFile(file.name);
    }
  };

  const toggleJurisdiction = (jurisdiction: string) => {
    setSelectedJurisdictions(prev =>
      prev.includes(jurisdiction)
        ? prev.filter(j => j !== jurisdiction)
        : [...prev, jurisdiction]
    );
  };

  const handleProcess = () => {
    if (uploadedFile && selectedJurisdictions.length > 0) {
      setProcessStarted(true);
      setTimeout(() => {
        setProcessComplete(true);
        setProcessStarted(false);
      }, 3000);
    }
  };

  const filteredCheckpoints = checkpoints.filter(cp => {
    if (filterStatus === 'all') return true;
    return cp.status === filterStatus;
  });

  const stats = {
    passed: checkpoints.filter(cp => cp.status === 'passed').length,
    review: checkpoints.filter(cp => cp.status === 'review').length,
    failed: checkpoints.filter(cp => cp.status === 'failed').length
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Starline Compliance System</h1>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { id: 'base' as TabType, label: 'Starline - Base' },
              { id: 'plus' as TabType, label: 'Starline - Plus' },
              { id: 'code' as TabType, label: 'Starline - Code' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Upload & Process */}
        <div className="flex-1 flex flex-col bg-white border-r border-gray-200 p-8 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Compliance Analysis</h2>

          {!processComplete ? (
            <div className="space-y-8">
              {/* Upload Section */}
              <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Floorplans</h3>
                  <p className="text-sm text-gray-600 text-center mb-6">
                    Upload floor plans, PDFs, or DWG exports for compliance checking
                  </p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.png,.jpg,.dwg"
                    />
                    <span className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block">
                      Choose File
                    </span>
                  </label>
                  {uploadedFile && (
                    <p className="text-sm text-green-600 mt-4 flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      {fileName}
                    </p>
                  )}
                </div>
              </div>

              {/* Jurisdictions Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Standards & Jurisdictions</h3>
                <p className="text-sm text-gray-600 mb-4">Choose applicable standards (multiple can be layered)</p>
                <div className="space-y-2">
                  {jurisdictions.map((jurisdiction, idx) => (
                    <label key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedJurisdictions.includes(jurisdiction)}
                        onChange={() => toggleJurisdiction(jurisdiction)}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-900">{jurisdiction}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Process Button */}
              <button
                onClick={handleProcess}
                disabled={!uploadedFile || selectedJurisdictions.length === 0}
                className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
              >
                Process Compliance Check (100+ Checkpoints)
              </button>

              {processStarted && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin">
                      <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full"></div>
                    </div>
                    <p className="text-blue-900 font-medium">Running compliance engine...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Results Summary */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Compliance Results</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-3xl font-bold text-green-600">{stats.passed}</p>
                    <p className="text-sm text-gray-600 mt-1">Checkpoints Passed</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-orange-200">
                    <p className="text-3xl font-bold text-orange-600">{stats.review}</p>
                    <p className="text-sm text-gray-600 mt-1">Need Review</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
                    <p className="text-sm text-gray-600 mt-1">Remediation Needed</p>
                  </div>
                </div>
              </div>

              {/* PDF Generation */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Compliance_Audit_Report.pdf</p>
                      <p className="text-sm text-gray-600">5.7 MB • 12 annotated pages</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setProcessComplete(false);
                  setUploadedFile(null);
                  setFileName('');
                  setSelectedJurisdictions([]);
                  setSelectedCheckpoint(null);
                }}
                className="w-full py-3 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Start New Analysis
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - Checklist */}
        {processComplete && (
          <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col">
            {/* Panel Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900">Compliance Checklist</h2>
              <p className="text-xs text-gray-500 mt-1">{filteredCheckpoints.length} checkpoints</p>
            </div>

            {/* Filter Buttons */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex gap-2">
              {['all', 'passed', 'review', 'failed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as FilterStatus)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status === 'all' ? 'All' : status === 'passed' ? '✓ Passed' : status === 'review' ? '⚠ Review' : '✗ Failed'}
                </button>
              ))}
            </div>

            {/* Checkpoints List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredCheckpoints.map((checkpoint: Checkpoint) => (
                <div
                  key={checkpoint.id}
                  onClick={() => setSelectedCheckpoint(checkpoint.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCheckpoint === checkpoint.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div>
                      {checkpoint.status === 'passed' && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      )}
                      {checkpoint.status === 'review' && (
                        <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      )}
                      {checkpoint.status === 'failed' && (
                        <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-600 mb-1">{checkpoint.section}</p>
                      <p className="text-sm font-medium text-gray-900 mb-1">{checkpoint.title}</p>
                      <p className="text-xs text-gray-600">{checkpoint.clause}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detailed View - Bottom Drawer */}
      {processComplete && selectedCheckpoint !== null && (
        <div className="border-t border-gray-200 bg-white p-6">
          {checkpoints
            .filter(cp => cp.id === selectedCheckpoint)
            .map(checkpoint => (
              <div key={checkpoint.id} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{checkpoint.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{checkpoint.section} • {checkpoint.clause}</p>
                  </div>
                  <button onClick={() => setSelectedCheckpoint(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>
                <p className="text-sm text-gray-700">{checkpoint.description}</p>
                <div className="pt-4 border-t border-gray-200">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    checkpoint.status === 'passed'
                      ? 'bg-green-100 text-green-800'
                      : checkpoint.status === 'review'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {checkpoint.status === 'passed' ? '✓ Passed' : checkpoint.status === 'review' ? '⚠ Needs Review' : '✗ Remediation Required'}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}