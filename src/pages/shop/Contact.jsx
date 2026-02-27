import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { storeInfo } from '../../data/store-info';
import SEO from '../../components/common/SEO';

const Contact = () => {
    return (
        <>
            <SEO
                title="Liên hệ"
                description={`${storeInfo.name} - ${storeInfo.address}. Điện thoại: ${storeInfo.phone}. Email: ${storeInfo.email}`}
                url="/contact"
            />
            <div className="contact-page pt-20 pb-24 min-h-screen bg-gray-50">
            <div className="container">
                <h1 className="text-3xl font-extrabold text-primary-dark mb-2">Liên hệ</h1>
                <p className="text-gray-600 mb-8">Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy ghé thăm cửa hàng hoặc liên hệ qua điện thoại.</p>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Thông tin liên hệ */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" /> Thông tin cửa hàng
                        </h2>
                        <div className="space-y-5">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Địa chỉ</p>
                                <p className="font-medium text-gray-800">{storeInfo.address}</p>
                                <a
                                    href={`https://www.google.com/maps/place/C%E1%BB%ADa+h%C3%A0ng+VTNN+N%C3%B4ng+Nghi%E1%BB%87p+Xanh/@11.3981591,107.8627239,17z/data=!4m6!3m5!1s0x3174053aa6f6de33:0x42cc74436b2f911b!8m2!3d11.3984107!4d107.8641042!16s%2Fg%2F11tf0wt0vj?entry=ttu&g_ep=EgoyMDI2MDIyNC4wIKXMDSoASAFQAw%3D%3D`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-primary text-sm mt-1 hover:underline"
                                >
                                    Xem trên Google Maps <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Điện thoại</p>
                                <a
                                    href={`tel:${storeInfo.phone.replace(/\s/g, '')}`}
                                    className="font-medium text-gray-800 hover:text-primary flex items-center gap-2"
                                >
                                    <Phone className="w-4 h-4" /> {storeInfo.phone}
                                </a>
                            </div>
                            {storeInfo.email && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Email</p>
                                    <a
                                        href={`mailto:${storeInfo.email}`}
                                        className="font-medium text-gray-800 hover:text-primary flex items-center gap-2"
                                    >
                                        <Mail className="w-4 h-4" /> {storeInfo.email}
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <Link to="/products" className="text-primary font-medium hover:underline">
                                ← Mua sắm sản phẩm
                            </Link>
                        </div>
                    </div>

                    {/* Google Map */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="aspect-[4/3] sm:aspect-video w-full">
                            <iframe
                                title="Bản đồ Cửa hàng Vật tư nông nghiệp - Nông Nghiệp Xanh"
                                src={storeInfo.mapEmbedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
};

export default Contact;
